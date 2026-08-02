-- =============================================================================
-- Comprovante de PIX nas reservas (bp-reserva).
--
-- Fluxo: o cliente reserva, paga o PIX e envia o comprovante (opcional);
-- o operador visualiza no Caixa para validar valor/data antes de confirmar.
-- Os arquivos são apagados pelo app quando a sessão fecha de vez.
--
-- Modelo de acesso (o bp-reserva usa a anon key, sem auth):
--   - anon: só UPLOAD no bucket, nunca ler/listar/apagar.
--   - authenticated (equipe): ler (signed URL) e apagar (limpeza pós-sessão).
--   - Bucket privado, máx. 5 MB, só imagem/PDF.
--
-- Aplicar no SQL Editor do painel do Supabase.
-- =============================================================================

begin;

-- Coluna que vincula o pedido ao arquivo no bucket
alter table public.orders add column if not exists receipt_path text;

-- Bucket privado com limites de tamanho e tipo
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pix-receipts',
  'pix-receipts',
  false,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Cliente (anon) pode apenas enviar
drop policy if exists "pix-receipts: anon upload" on storage.objects;
create policy "pix-receipts: anon upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'pix-receipts');

-- Equipe autenticada pode visualizar (signed URL) e apagar (limpeza)
drop policy if exists "pix-receipts: staff read" on storage.objects;
create policy "pix-receipts: staff read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'pix-receipts');

drop policy if exists "pix-receipts: staff delete" on storage.objects;
create policy "pix-receipts: staff delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'pix-receipts');

commit;

-- =============================================================================
-- Reverter:
--   drop policy if exists "pix-receipts: anon upload" on storage.objects;
--   drop policy if exists "pix-receipts: staff read" on storage.objects;
--   drop policy if exists "pix-receipts: staff delete" on storage.objects;
--   delete from storage.buckets where id = 'pix-receipts'; -- exige bucket vazio
--   alter table public.orders drop column if exists receipt_path;
-- =============================================================================
