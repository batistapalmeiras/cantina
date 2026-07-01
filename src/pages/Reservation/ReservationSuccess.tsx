import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { Typography } from '../../components/Typography';
import { Button } from '../../components/Button';
import { InfoBox } from '../../components/InfoBox';
import { AppRoute } from '../../routes/paths';
import icon from '../../assets/icon.png';

interface SuccessState {
  paymentMethod: PaymentMethod;
  total: number;
  pixKey: string;
}

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.canvas};
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.base};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.base} 0;
`;

const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const BrandName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const BrandSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 1px;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SuccessCard = styled.div`
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.sm};
  animation: ${fadeIn} 0.3s ease;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.rounded.full};
  background: #f0faf5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a7a4a;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export function ReservationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SuccessState | null;

  // Se acessar a rota diretamente sem state, redireciona para /reserva
  if (!state) {
    navigate(AppRoute.Reservation, { replace: true });
    return null;
  }

  const { paymentMethod, total, pixKey } = state;

  return (
    <Page>
      <Container>
        <Header>
          <BrandLogo src={icon} alt="Cantina Batista Palmeiras" />
          <div>
            <BrandName>Cantina Batista Palmeiras</BrandName>
            <BrandSub>Reserva confirmada</BrandSub>
          </div>
        </Header>

        <SuccessCard>
          <SuccessIcon>
            <CheckCircle size={32} />
          </SuccessIcon>
          <Typography type="h3">Reserva registrada!</Typography>
          <Typography type="p">Seu pedido foi recebido com sucesso.</Typography>

          {paymentMethod === PaymentMethod.Pix ? (
            <InfoBox variant="warning">
              <strong>Pague via Pix</strong><br />
              Chave: <strong>{pixKey}</strong><br />
              Valor: <strong>R$ {total.toFixed(2)}</strong><br />
              Apresente o comprovante no caixa.
            </InfoBox>
          ) : (
            <InfoBox variant="warning">
              Acerte <strong>R$ {total.toFixed(2)}</strong> em dinheiro no caixa.
            </InfoBox>
          )}
        </SuccessCard>

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => navigate(AppRoute.Reservation)}
        >
          Voltar às reservas
        </Button>
      </Container>
    </Page>
  );
}
