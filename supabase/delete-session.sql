-- =============================================================================
-- Remoção completa de uma sessão e tudo relacionado a ela.
--
-- Cadeia de dependências (removida de fora para dentro):
--   ticket_items -> orders -> addons -> dishes -> sessions
--
-- A tabela `clients` NÃO é tocada: é um cadastro independente, sem vínculo
-- com sessão (os pedidos gravam nome/telefone direto).
--
-- ATENÇÃO: se os triggers de imutabilidade (immutable-closed-sessions.sql)
-- estiverem aplicados, eles bloqueiam a exclusão de sessão encerrada.
-- Descomente os blocos DISABLE/ENABLE abaixo nesse caso.
-- =============================================================================

do $$
declare
  v_session_id uuid := '00000000-0000-0000-0000-000000000000'; -- << ID da sessão aqui
begin
  -- Se os triggers de imutabilidade estiverem aplicados, descomente:
  -- alter table public.sessions     disable trigger trg_immutable_closed_session;
  -- alter table public.orders       disable trigger trg_closed_session_orders;
  -- alter table public.ticket_items disable trigger trg_closed_session_ticket_items;
  -- alter table public.dishes       disable trigger trg_closed_session_dishes;
  -- alter table public.addons       disable trigger trg_closed_session_addons;

  -- 1. Fichinhas dos pedidos da sessão
  delete from public.ticket_items
   where order_id in (select id from public.orders where session_id = v_session_id);

  -- 2. Pedidos da sessão
  delete from public.orders
   where session_id = v_session_id;

  -- 3. Acréscimos dos pratos da sessão
  delete from public.addons
   where dish_id in (select id from public.dishes where session_id = v_session_id);

  -- 4. Pratos da sessão
  delete from public.dishes
   where session_id = v_session_id;

  -- 5. A sessão em si
  delete from public.sessions
   where id = v_session_id;

  -- Reativa os triggers (descomente junto com o bloco acima):
  -- alter table public.sessions     enable trigger trg_immutable_closed_session;
  -- alter table public.orders       enable trigger trg_closed_session_orders;
  -- alter table public.ticket_items enable trigger trg_closed_session_ticket_items;
  -- alter table public.dishes       enable trigger trg_closed_session_dishes;
  -- alter table public.addons       enable trigger trg_closed_session_addons;
end $$;

-- =============================================================================
-- Conferência ANTES de rodar (o que será apagado):
--
-- select
--   (select count(*) from public.orders       where session_id = 'ID_AQUI') as pedidos,
--   (select count(*) from public.ticket_items where order_id in
--       (select id from public.orders where session_id = 'ID_AQUI'))        as fichinhas,
--   (select count(*) from public.dishes       where session_id = 'ID_AQUI') as pratos,
--   (select count(*) from public.addons       where dish_id in
--       (select id from public.dishes where session_id = 'ID_AQUI'))        as acrescimos;
--
-- Para descobrir o ID da sessão:
--   select id, date, ministry, is_open, status from public.sessions order by created_at desc;
-- =============================================================================
