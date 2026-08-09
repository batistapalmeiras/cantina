-- =============================================================================
-- Faixas de preço por quantidade (promoção dinâmica por prato).
--
-- A faixa de quantidade 1 já existe como `dishes.price` (preço unitário).
-- Esta tabela guarda apenas faixas EXTRAS (quantity >= 2), ex:
--   quantity=2, price=35  ->  "2 unidades por R$35"
-- Um prato sem nenhuma linha aqui continua com preço linear normal
-- (quantidade × dishes.price), sem promoção.
-- =============================================================================

create table if not exists public.dish_price_tiers (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid not null references public.dishes(id) on delete cascade,
  quantity int not null check (quantity >= 2),
  price numeric not null check (price >= 0),
  unique (dish_id, quantity)
);

create index if not exists idx_dish_price_tiers_dish_id on public.dish_price_tiers(dish_id);

-- RLS: siga a mesma configuração já aplicada em `addons`/`dishes` (ver
-- CONVENTIONS.md — RLS desabilitada ou com política de leitura/escrita
-- pública). Não Realtime aqui: mesma categoria de `addons`, que também não
-- está na lista de tabelas com Realtime habilitado.
