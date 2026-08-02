// React
import { useRef, useState } from 'react';
// Libs
import { uploadPixReceipt } from 'bp-core';
import { Button } from 'bp-kit';
import { CheckCircle, Paperclip } from 'lucide-react';
// Local
import { HiddenInput, Hint, ResendLink, SentBadge, Wrapper } from './styles';

interface IReceiptUploadProps {
  orderId: string;
  /** Pedido já tem comprovante vinculado (permite reenviar). */
  alreadySent?: boolean;
  onSent?: () => void;
  onError?: (message: string) => void;
}

export function ReceiptUpload({ orderId, alreadySent = false, onSent, onError }: IReceiptUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(alreadySent);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setSending(true);
    try {
      await uploadPixReceipt(orderId, file);
      setSent(true);
      onSent?.();
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Erro ao enviar o comprovante.');
    } finally {
      setSending(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Wrapper>
      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {sent ? (
        <>
          <SentBadge>
            <CheckCircle size={16} />
            Comprovante enviado
          </SentBadge>
          <ResendLink disabled={sending} onClick={() => inputRef.current?.click()}>
            {sending ? 'Enviando...' : 'Enviar outro comprovante'}
          </ResendLink>
        </>
      ) : (
        <>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            disabled={sending}
            onClick={() => inputRef.current?.click()}
          >
            <Paperclip size={16} />
            {sending ? 'Enviando...' : 'Enviar comprovante do Pix'}
          </Button>
          <Hint>Ou apresente no caixa após o culto.</Hint>
        </>
      )}
    </Wrapper>
  );
}
