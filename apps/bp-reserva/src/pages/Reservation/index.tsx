import { useNavigate } from 'react-router-dom';
import { ORDER_STATUS_LABEL, OrderStatus, PAYMENT_METHOD_LABEL, useClient, PaymentMethod } from 'bp-core';
import { Button, DishSelector, InfoBox, PageHeader, PaymentToggle, Typography, useModal, useToast } from 'bp-ui';
import { CancelConfirmDialog } from './components/CancelConfirmDialog';
import { useReservation } from './hooks/useReservation';
import {
  Card,
  CardLabel,
  CancelLink,
  Empty,
  StatusBadge,
  SummaryHeader,
  TotalLabel,
  TotalLine,
  TotalValue,
} from './styles';
import { AppRoute } from '../../routes/paths';

export function ReservationPage() {
  const { client } = useClient();
  const { open, close, modal } = useModal();
  const navigate = useNavigate();
  const { show: showToast, toast } = useToast();

  const {
    session,
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
    submitReservation,
    cancelReservation,
  } = useReservation();

  if (orderError) {
    showToast(orderError);
  }

  if (!session || !session.isOpen) {
    return (
      <Empty>
        <Typography type="h3">Reservas indisponíveis</Typography>
        <Typography type="p">Nenhuma sessão está aberta no momento.</Typography>
      </Empty>
    );
  }

  if (!client) return null;

  const clientOrder = (session.orders ?? []).find(
    (o) => o.customerPhone === client.phone && o.status === OrderStatus.Reservation
  ) ?? null;

  if (clientOrder) {
    const dishSummary = Object.values(
      clientOrder.tickets.reduce<Record<string, { name: string; qty: number }>>((acc, t) => {
        if (!acc[t.dishName]) acc[t.dishName] = { name: t.dishName, qty: 0 };
        acc[t.dishName].qty++;
        return acc;
      }, {})
    )
      .map((g) => `${g.qty}× ${g.name}`)
      .join(', ');

    return (
      <>
        <PageHeader
          title="Sua reserva"
          subtitle="Resumo do seu pedido e opções de edição."
        />

        <Card>
          <SummaryHeader>
            <CardLabel style={{ marginBottom: 0 }}>Resumo</CardLabel>
            <StatusBadge $status={OrderStatus.Reservation}>
              {ORDER_STATUS_LABEL[OrderStatus.Reservation]}
            </StatusBadge>
          </SummaryHeader>
          <Typography type="p">{dishSummary}</Typography>
          <Typography type="p" style={{ marginTop: 4 }}>
            Pagamento: {PAYMENT_METHOD_LABEL[clientOrder.paymentMethod]}
          </Typography>
          <TotalLine>
            <TotalLabel>Total</TotalLabel>
            <TotalValue>R$ {clientOrder.total.toFixed(2)}</TotalValue>
          </TotalLine>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate(`${AppRoute.ReservationEdit}/${clientOrder.id}`)}
        >
          Editar pedido
        </Button>

        <CancelLink
          onClick={() =>
            open(
              <CancelConfirmDialog
                close={close}
                onConfirm={() => {
                  cancelReservation(clientOrder.id);
                }}
              />
            )
          }
        >
          Cancelar pedido
        </CancelLink>

        {modal}
        {toast}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Faça sua reserva aqui"
        subtitle="Escolha o prato e garanta sua fichinha para o culto."
      />

      <Card>
        <CardLabel>Fichinhas</CardLabel>
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

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={() =>
          submitReservation({ name: client.name, phone: client.phone }, () => {
            showToast('Confirmado!');
          })
        }
        disabled={tickets.length === 0 || isSaving}
      >
        {isSaving ? 'Confirmando...' : 'Confirmar reserva'}
      </Button>

      {modal}
      {toast}
    </>
  );
}
