-- =============================================================================
-- Sessão encerrada é imutável.
--
-- Regra: uma vez encerrada (is_open = false), nada relacionado à sessão pode
-- ser alterado. Única exceção: pedidos PENDENTES (status = 'reservation')
-- podem ser confirmados (-> 'sale') ou cancelados (excluídos) — e nada mais.
--
-- Implementado com triggers BEFORE (não RLS) porque:
--   1. Triggers valem para qualquer role, inclusive service_role.
--   2. RLS não consegue comparar OLD x NEW coluna a coluna (necessário para
--      permitir "só o status mudou" na confirmação).
--
-- Fluxos que continuam funcionando:
--   - Confirmar reserva de sessão pendente: UPDATE orders (reservation->sale).
--   - Cancelar reserva de sessão pendente: devolução de fichinhas
--     (dishes.sold_tickets diminui), DELETE ticket_items, DELETE orders.
--   - Fechamento automático: UPDATE sessions (pending -> closed) quando a
--     última reserva é resolvida.
--
-- Aplicar no SQL Editor do painel do Supabase.
-- =============================================================================

begin;

-- Helper: a sessão está aberta?
create or replace function public.session_is_open(p_session_id uuid)
returns boolean
language sql
stable
as $$
  select coalesce(
    (select s.is_open from public.sessions s where s.id = p_session_id),
    false
  );
$$;

-- -----------------------------------------------------------------------------
-- SESSIONS: encerrada não muda; única transição permitida é pending -> closed
-- (fechamento automático), sem tocar em nenhuma outra coluna.
-- -----------------------------------------------------------------------------
create or replace function public.enforce_immutable_closed_session()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    if not old.is_open then
      raise exception 'Sessão encerrada não pode ser excluída.';
    end if;
    return old;
  end if;

  -- UPDATE
  if old.is_open then
    return new;
  end if;

  if old.status = 'pending'
     and new.status = 'closed'
     and (to_jsonb(new) - 'status') = (to_jsonb(old) - 'status')
  then
    return new; -- fechamento automático ao resolver a última reserva
  end if;

  raise exception 'Sessão encerrada não pode ser alterada.';
end;
$$;

drop trigger if exists trg_immutable_closed_session on public.sessions;
create trigger trg_immutable_closed_session
  before update or delete on public.sessions
  for each row execute function public.enforce_immutable_closed_session();

-- -----------------------------------------------------------------------------
-- ORDERS: em sessão encerrada, só reserva pendente pode ser confirmada
-- (somente a coluna status, reservation -> sale) ou cancelada (DELETE).
-- -----------------------------------------------------------------------------
create or replace function public.enforce_closed_session_orders()
returns trigger
language plpgsql
as $$
declare
  v_open boolean;
begin
  if tg_op = 'INSERT' then
    if not public.session_is_open(new.session_id) then
      raise exception 'Não é possível criar pedido em sessão encerrada.';
    end if;
    return new;
  end if;

  v_open := public.session_is_open(old.session_id);

  if tg_op = 'UPDATE' then
    if v_open then
      return new;
    end if;

    if old.status = 'reservation'
       and new.status = 'sale'
       and (to_jsonb(new) - 'status') = (to_jsonb(old) - 'status')
    then
      return new; -- confirmação de reserva pendente
    end if;

    raise exception 'Pedido de sessão encerrada não pode ser alterado; apenas reservas pendentes podem ser confirmadas ou canceladas.';
  end if;

  -- DELETE
  if v_open or old.status = 'reservation' then
    return old; -- cancelamento de reserva pendente
  end if;

  raise exception 'Pedido de sessão encerrada não pode ser excluído; apenas reservas pendentes podem ser canceladas.';
end;
$$;

drop trigger if exists trg_closed_session_orders on public.orders;
create trigger trg_closed_session_orders
  before insert or update or delete on public.orders
  for each row execute function public.enforce_closed_session_orders();

-- -----------------------------------------------------------------------------
-- TICKET_ITEMS: em sessão encerrada, só podem ser excluídos como parte do
-- cancelamento de uma reserva pendente (o pedido-pai ainda é 'reservation').
-- Se o pedido-pai já não existir (ex.: cascade), a exclusão é liberada.
-- -----------------------------------------------------------------------------
create or replace function public.enforce_closed_session_ticket_items()
returns trigger
language plpgsql
as $$
declare
  v_order_id uuid;
  v_status text;
  v_session_id uuid;
begin
  v_order_id := coalesce(
    case when tg_op = 'DELETE' then old.order_id else new.order_id end,
    old.order_id
  );

  select o.status, o.session_id into v_status, v_session_id
    from public.orders o where o.id = v_order_id;

  if not found then
    return coalesce(new, old); -- pai já removido (cascade)
  end if;

  if public.session_is_open(v_session_id) then
    return coalesce(new, old);
  end if;

  if tg_op = 'DELETE' and v_status = 'reservation' then
    return old; -- cancelamento de reserva pendente
  end if;

  raise exception 'Fichinhas de sessão encerrada não podem ser alteradas; apenas removidas ao cancelar uma reserva pendente.';
end;
$$;

drop trigger if exists trg_closed_session_ticket_items on public.ticket_items;
create trigger trg_closed_session_ticket_items
  before insert or update or delete on public.ticket_items
  for each row execute function public.enforce_closed_session_ticket_items();

-- -----------------------------------------------------------------------------
-- DISHES: em sessão encerrada, a única alteração permitida é a devolução de
-- fichinhas (sold_tickets DIMINUI) causada pelo cancelamento de uma reserva
-- pendente (RPC adjust_tickets com delta negativo). Nada mais muda.
-- -----------------------------------------------------------------------------
create or replace function public.enforce_closed_session_dishes()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if not public.session_is_open(new.session_id) then
      raise exception 'Não é possível criar prato em sessão encerrada.';
    end if;
    return new;
  end if;

  if public.session_is_open(old.session_id) then
    return coalesce(new, old);
  end if;

  if tg_op = 'UPDATE'
     and new.sold_tickets < old.sold_tickets
     and (to_jsonb(new) - 'sold_tickets') = (to_jsonb(old) - 'sold_tickets')
  then
    return new; -- devolução de fichinhas ao cancelar reserva pendente
  end if;

  raise exception 'Prato de sessão encerrada não pode ser alterado.';
end;
$$;

drop trigger if exists trg_closed_session_dishes on public.dishes;
create trigger trg_closed_session_dishes
  before insert or update or delete on public.dishes
  for each row execute function public.enforce_closed_session_dishes();

-- -----------------------------------------------------------------------------
-- ADDONS: nenhum fluxo pós-encerramento toca em acréscimos — bloqueio total
-- quando a sessão do prato não está aberta.
-- -----------------------------------------------------------------------------
create or replace function public.enforce_closed_session_addons()
returns trigger
language plpgsql
as $$
declare
  v_dish_id uuid;
  v_session_id uuid;
begin
  v_dish_id := case when tg_op = 'DELETE' then old.dish_id else new.dish_id end;

  select d.session_id into v_session_id
    from public.dishes d where d.id = v_dish_id;

  if not found then
    return coalesce(new, old); -- prato já removido (cascade)
  end if;

  if not public.session_is_open(v_session_id) then
    raise exception 'Acréscimo de sessão encerrada não pode ser alterado.';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_closed_session_addons on public.addons;
create trigger trg_closed_session_addons
  before insert or update or delete on public.addons
  for each row execute function public.enforce_closed_session_addons();

commit;

-- =============================================================================
-- Reverter tudo (se precisar):
--
--   drop trigger if exists trg_immutable_closed_session on public.sessions;
--   drop trigger if exists trg_closed_session_orders on public.orders;
--   drop trigger if exists trg_closed_session_ticket_items on public.ticket_items;
--   drop trigger if exists trg_closed_session_dishes on public.dishes;
--   drop trigger if exists trg_closed_session_addons on public.addons;
--   drop function if exists public.enforce_immutable_closed_session();
--   drop function if exists public.enforce_closed_session_orders();
--   drop function if exists public.enforce_closed_session_ticket_items();
--   drop function if exists public.enforce_closed_session_dishes();
--   drop function if exists public.enforce_closed_session_addons();
--   drop function if exists public.session_is_open(uuid);
-- =============================================================================
