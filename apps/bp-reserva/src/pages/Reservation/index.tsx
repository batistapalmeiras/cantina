// React
import { useEffect, useState } from 'react';
// Libs
import { ORDER_STATUS_LABEL, OrderStatus, PAYMENT_METHOD_LABEL, PaymentMethod, useClient } from 'bp-core';
import { Button, DishSelector, InfoBox, PageHeader, PaymentToggle, Typography, useModal, useToast } from 'bp-ui';
// Local
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

export function ReservationPage() {
  const { client } = useClient();
  const { open, close, modal } = useModal();
  const [editing, setEditing] = useState(false);

  const {
    session,
    paymentMethod,
    setPaymentMethod,
    quantities,
    tickets,
    total,
    clientOrder,
    orderError,
    increment,
    decrement,
    setAddonCount,
    submitReservation,
    saveReservation,
    cancelReservation,
    discardChanges,
  } = useReservation(client?.phone);

  const { show: showToast, toast } = useToast();

  useEffect(() => { if (orderError) showToast(orderError); }, [orderError]);

  if (!session || !session.isOpen) {
    return (
      <Empty>
        <Typography type="h3">Reservas indisponíveis</Typography>
        <Typography type="p">Nenhuma sessão está aberta no momento.</Typography>
      </Empty>
    );
  }

  if (!client) return null;

  const openCancelDialog = () =>
    open(
      <CancelConfirmDialog
        close={close}
        onConfirm={() => {
          cancelReservation();
          setEditing(false);
        }}
      />
    );

  if (clientOrder && !editing) {
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
        <PageHeader title="Sua reserva" subtitle="Confira os detalhes do seu pedido para este culto." />

        <Card>
          <SummaryHeader>
            <CardLabel style={{ marginBottom: 0 }}>Resumo</CardLabel>
            <StatusBadge $status={OrderStatus.Reservation}>{ORDER_STATUS_LABEL[OrderStatus.Reservation]}</StatusBadge>
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

        <Button variant="primary" size="lg" fullWidth onClick={() => setEditing(true)}>
          Editar pedido
        </Button>

        <CancelLink onClick={openCancelDialog}>Cancelar pedido</CancelLink>

        {modal}
        {toast}
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={clientOrder ? 'Editar reserva' : 'Faça sua reserva aqui'}
        subtitle="Escolha o prato e garanta sua fichinha para o culto."
      />

      <Card>
        <CardLabel>{clientOrder ? 'Sua reserva' : 'Fichinhas'}</CardLabel>
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
          <InfoBox variant="warning" style={{ marginTop: 12 }}>Apresente o comprovante Pix no caixa após o culto.</InfoBox>
        )}
        {paymentMethod === PaymentMethod.Cash && (
          <InfoBox variant="warning" style={{ marginTop: 12 }}>Acerte o pagamento em dinheiro no caixa após o culto.</InfoBox>
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
        onClick={
          clientOrder
            ? () => saveReservation(client.name, client.phone, () => {
                showToast('Reserva atualizada com sucesso!');
                setEditing(false);
              })
            : () => submitReservation({ name: client.name, phone: client.phone })
        }
        disabled={tickets.length === 0}
      >
        {clientOrder ? 'Salvar alterações' : 'Confirmar reserva'}
      </Button>

      {clientOrder && (
        <CancelLink
          onClick={() => {
            discardChanges();
            setEditing(false);
          }}
        >
          Cancelar edição
        </CancelLink>
      )}

      {modal}
      {toast}
    </>
  );
}
