// React
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
// Libs
import { PAYMENT_METHOD_LABEL, PIX_SURCHARGE, PaymentMethod } from 'bp-core';
import { Button, formatCNPJ, formatCurrency, InfoBox, Typography, useToast } from 'bp-kit';
import { Check, CheckCircle, Copy } from 'lucide-react';
// Components
import { ReceiptUpload } from '../../components/ReceiptUpload';
import { AppRoute } from '../../routes/paths';
// Local
import {
  CopyBtn,
  PixKeyBox,
  PixKeyLabel,
  PixKeyRow,
  PixKeyValue,
  SuccessIcon,
  SuccessWrap,
  SummaryDivider,
  SummaryItem,
  SummaryLabel,
  SummaryRow,
  SummaryValue,
  SurchargeNote,
} from './styles';

interface SuccessState {
  paymentMethod: PaymentMethod;
  total: number;
  pixKey: string;
  orderId?: string | null;
}

export function ReservationConfirmedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SuccessState | null;
  const { show: showToast, toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!state) {
    return <Navigate to={AppRoute.Reservation} replace />;
  }

  const { paymentMethod, total, pixKey, orderId } = state;
  const formattedPixKey = formatCNPJ(pixKey);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedPixKey);
    setCopied(true);
    showToast('Chave Pix copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SuccessWrap>
          <SuccessIcon>
            <CheckCircle size={32} />
          </SuccessIcon>
          <Typography type="h3">Reserva registrada!</Typography>
          <Typography type="p">Seu pedido foi recebido com sucesso.</Typography>

          <SummaryRow>
            <SummaryItem>
              <SummaryLabel>Pagamento</SummaryLabel>
              <SummaryValue>{PAYMENT_METHOD_LABEL[paymentMethod]}</SummaryValue>
            </SummaryItem>
            <SummaryDivider />
            <SummaryItem>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>{formatCurrency(total)}</SummaryValue>
            </SummaryItem>
          </SummaryRow>

          {paymentMethod === PaymentMethod.Pix && (
            <SurchargeNote>
              Os {formatCurrency(PIX_SURCHARGE)} extras identificam o pagamento da cantina na contabilidade da
              igreja.
            </SurchargeNote>
          )}

          {paymentMethod === PaymentMethod.Pix && (
            <PixKeyBox>
              <PixKeyLabel>Chave Pix (CNPJ)</PixKeyLabel>
              <PixKeyRow>
                <PixKeyValue>{formattedPixKey}</PixKeyValue>
                <CopyBtn onClick={handleCopy}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado' : 'Copiar'}
                </CopyBtn>
              </PixKeyRow>
            </PixKeyBox>
          )}

          {paymentMethod === PaymentMethod.Pix && orderId && (
            <ReceiptUpload
              orderId={orderId}
              onSent={() => showToast('Comprovante enviado!')}
              onError={(msg) => showToast(msg)}
            />
          )}

          {paymentMethod === PaymentMethod.Cash && (
            <InfoBox variant="warning">Acerte o pagamento em dinheiro no caixa após o culto.</InfoBox>
          )}
        </SuccessWrap>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => navigate(AppRoute.Reservation)}
        >
          Voltar às reservas
        </Button>

        {toast}
    </>
  );
}
