import { useParams } from 'react-router-dom';
import { useClient, PaymentMethod } from 'bp-core';
import { Button, DishSelector, InfoBox, PageHeader, PaymentToggle, Typography, useToast } from 'bp-ui';
import { useEditReservation } from './hooks';
import {
  Card,
  CardLabel,
  TotalLabel,
  TotalLine,
  TotalValue,
} from '../Reservation/styles';
import { ButtonGroup } from './styles';

export function EditReservationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { client } = useClient();
  const { show: showToast, toast } = useToast();

  const {
    session,
    currentOrder,
    paymentMethod,
    setPaymentMethod,
    quantities,
    tickets,
    total,
    orderError,
    isSaving,
    increment,
    decrement,
    setAddonCount,
    saveReservation,
    cancelEdit,
  } = useEditReservation(orderId || '');

  if (!orderId || !client) return null;

  if (!session || !session.isOpen) {
    return (
      <div>
        <Typography type="h3">Reservas indisponíveis</Typography>
        <Typography type="p">Nenhuma sessão está aberta no momento.</Typography>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div>
        <Typography type="h3">Pedido não encontrado</Typography>
        <Typography type="p">Não conseguimos carregar este pedido.</Typography>
      </div>
    );
  }

  if (orderError) {
    showToast(orderError);
  }

  return (
    <>
      <PageHeader
        back
        title="Editar reserva"
        subtitle="Escolha o prato e atualize sua fichinha para o culto."
      />

      <Card>
        <CardLabel>Sua reserva</CardLabel>
        <DishSelector
          dishes={session.dishes}
          quantities={quantities}
          onIncrement={increment}
          onDecrement={decrement}
          onSetAddonCount={setAddonCount}
        />
      </Card>

      <Card>
        <PaymentToggle label="Forma de pagamento" value={paymentMethod} onChange={setPaymentMethod} />
        {paymentMethod === PaymentMethod.Pix && (
          <InfoBox variant="warning" style={{ marginTop: 12 }}>
            Apresente o comprovante Pix no caixa após o culto.
          </InfoBox>
        )}
        {paymentMethod === PaymentMethod.Cash && (
          <InfoBox variant="warning" style={{ marginTop: 12 }}>
            Acerte o pagamento em dinheiro no caixa após o culto.
          </InfoBox>
        )}
        <TotalLine>
          <TotalLabel>Total</TotalLabel>
          <TotalValue>R$ {total.toFixed(2)}</TotalValue>
        </TotalLine>
      </Card>

      <ButtonGroup>
        <Button fullWidth  variant="secondary" size="md" onClick={cancelEdit}>
          Cancelar edição
        </Button>
        <Button
          fullWidth
          variant="primary"
          size="md"
          onClick={() =>
            saveReservation(client.name, client.phone, () => {
              showToast('Pedido atualizado!');
            })
          }
          disabled={tickets.length === 0 || isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </ButtonGroup>
      {toast}
    </>
  );
}
