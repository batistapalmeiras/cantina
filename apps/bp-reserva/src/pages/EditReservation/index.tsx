// React
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Libs
import { useClient, PAYMENT_METHOD_LABEL, PaymentMethod } from 'bp-core';
import { DishSelector, PageHeader, SegmentedControl, SummaryCard, Typography, useMediaQuery, useToast } from 'bp-ui';
// Local
import { useEditReservation } from './hooks';
import { BottomSpacer, DishSelectorWrapper, PageWrapper, PaymentControlsWrapper } from './styles';
import { summarizeTickets } from './domain';

export function EditReservationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { client } = useClient();
  const { show: showToast, toast } = useToast();
  const isWide = useMediaQuery('(min-width: 745px)');

  const {
    session,
    currentOrder,
    paymentMethod,
    setPaymentMethod,
    stayForMeal,
    setStayForMeal,
    quantities,
    reservedByDish,
    tickets,
    baseTotal,
    total: _total,
    orderError,
    isSaving,
    increment,
    decrement,
    setAddonCount,
    saveReservation,
    cancelEdit,
  } = useEditReservation(orderId || '');

  useEffect(() => {
    if (orderError) showToast(orderError);
  }, [orderError, showToast]);

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

  return (
    <PageWrapper>
      <PageHeader
        back
        title="Editar reserva"
        subtitle="Escolha o prato e atualize sua fichinha para o culto."
      />

      <DishSelectorWrapper>
        <DishSelector
          label="Fichinhas"
          dishes={session.dishes}
          quantities={quantities}
          reserved={reservedByDish}
          onIncrement={increment}
          onDecrement={decrement}
          onSetAddonCount={setAddonCount}
        />
      </DishSelectorWrapper>

      <div>
        <SegmentedControl
          label="Forma de pagamento"
          value={paymentMethod}
          onChange={setPaymentMethod}
          options={[
            { value: PaymentMethod.Cash, label: PAYMENT_METHOD_LABEL[PaymentMethod.Cash] },
            { value: PaymentMethod.Pix, label: PAYMENT_METHOD_LABEL[PaymentMethod.Pix] },
          ]}
        />
        <PaymentControlsWrapper>
          <SegmentedControl
            label="Ficará no Espaço de Convivência?"
            tone="primary"
            value={stayForMeal}
            onChange={setStayForMeal}
            options={[
              { value: false, label: 'Não, vou levar' },
              { value: true, label: 'Sim' },
            ]}
          />
        </PaymentControlsWrapper>
      </div>

      <BottomSpacer />

      {(isWide || tickets.length > 0) && (
        <SummaryCard
          bottomOffset="0"
          items={summarizeTickets(tickets)}
          total={baseTotal}
          buttons={[
            {
              text: 'Cancelar edição',
              onClick: cancelEdit,
              variant: 'secondary',
            },
            {
              text: 'Salvar alterações',
              onClick: () =>
                saveReservation(client.name, client.phone, () => {
                  showToast('Pedido atualizado!');
                }),
              loading: isSaving,
              disabled: tickets.length === 0,
            },
          ]}
        />
      )}
      {toast}
    </PageWrapper>
  );
}
