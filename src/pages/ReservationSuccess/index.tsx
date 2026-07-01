// React
import { useLocation, useNavigate } from 'react-router-dom';
// Libs
import { CheckCircle } from 'lucide-react';
// Components
import icon from '../../assets/icon.png';
import { Button } from '../../components/Button';
import { InfoBox } from '../../components/InfoBox';
import { Typography } from '../../components/Typography';
import { AppRoute } from '../../routes/paths';
import { PaymentMethod } from '../../types';
// Local
import { BrandLogo, BrandName, BrandSub, Container, Header, Page, SuccessCard, SuccessIcon } from './styles';

interface SuccessState {
  paymentMethod: PaymentMethod;
  total: number;
  pixKey: string;
}

export function ReservationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SuccessState | null;

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
