// Local
import { supabase } from './supabase';

const RECEIPTS_BUCKET = 'pix-receipts';
const SIGNED_URL_TTL_SECONDS = 60 * 5;
const MAX_IMAGE_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;

/**
 * Redimensiona/comprime imagens no cliente antes do upload — o plano free do
 * Supabase não tem transformação de imagem no servidor, e comprovantes são
 * screenshots que chegam a alguns MB. PDFs passam direto.
 */
async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 500 * 1024) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao comprimir a imagem'))),
      'image/jpeg',
      JPEG_QUALITY,
    );
  });
}

/**
 * Envia o comprovante e vincula ao pedido (orders.receipt_path).
 * Reenvio gera um arquivo novo; o antigo vira órfão e é removido na limpeza
 * pós-sessão. Retorna o path salvo.
 */
export async function uploadPixReceipt(orderId: string, file: File): Promise<string> {
  const blob = await compressImage(file);
  const extension = blob.type === 'application/pdf' ? 'pdf' : 'jpg';
  const path = `${orderId}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(RECEIPTS_BUCKET)
    .upload(path, blob, { contentType: blob.type });
  if (uploadError) throw new Error('Erro ao enviar o comprovante. Tente novamente.');

  const { error: updateError } = await supabase
    .from('orders')
    .update({ receipt_path: path })
    .eq('id', orderId);
  if (updateError) throw new Error('Comprovante enviado, mas não foi possível vinculá-lo ao pedido.');

  return path;
}

/** URL temporária para a equipe visualizar o comprovante (bucket privado). */
export async function getReceiptUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(RECEIPTS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error || !data) throw new Error('Não foi possível abrir o comprovante.');
  return data.signedUrl;
}

/**
 * Remove todos os comprovantes dos pedidos informados (inclui reenvios órfãos,
 * pois cada pedido tem sua própria pasta). Chamado quando a sessão fecha de
 * vez — os arquivos não precisam ser mantidos depois disso.
 */
export async function removeReceiptsForOrders(orderIds: string[]): Promise<void> {
  const paths: string[] = [];
  for (const orderId of orderIds) {
    const { data } = await supabase.storage.from(RECEIPTS_BUCKET).list(orderId);
    (data ?? []).forEach((f) => paths.push(`${orderId}/${f.name}`));
  }
  if (paths.length > 0) {
    await supabase.storage.from(RECEIPTS_BUCKET).remove(paths);
  }
}
