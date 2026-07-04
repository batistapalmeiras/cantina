import { useParams } from 'react-router-dom';
import { useClient, PAYMENT_METHOD_LABEL, PaymentMethod } from 'bp-core';
import { Button, DishSelector, PageHeader, SegmentedControl, Typography, useToast } from 'bp-ui';
import { useEditReservation } from './hooks';
import { CardLabel } from '../Reservation/styles';
import {
  BottomBar,
  BottomBarInfo,
  BottomBarItems,
  BottomBarRow,
  BottomBarTotal,
  BottomSpacer,
  ButtonRow,
} from './styles';

export function EditReservationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { client } = useClient();
  const { show: showToast, toast } = useToast();

  const {
    session,
    currentOrder,
    paymentMethod,
    setPaymentMethod,
    stayForMeal,
    setStayForMeal,
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

      <div>
        <CardLabel>Sua reserva</CardLabel>
        <DishSelector
          dishes={session.dishes}
          quantities={quantities}
          onIncrement={increment}
          onDecrement={decrement}
          onSetAddonCount={setAddonCount}
        />
      </div>

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
        <div style={{ marginTop: 16 }}>
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
        </div>
      </div>

      <BottomSpacer />

      <BottomBar>
        <CardLabel>Resumo</CardLabel>

        <BottomBarRow>
          <BottomBarInfo>
            <BottomBarItems>
              {Object.values(
                tickets.reduce<Record<string, { name: string; qty: number }>>((acc, t) => {
                  if (!acc[t.dishName]) acc[t.dishName] = { name: t.dishName, qty: 0 };
                  acc[t.dishName].qty++;
                  return acc;
                }, {})
              ).map((g) => `${g.qty}× ${g.name}`).join(', ')}
            </BottomBarItems>
            <BottomBarTotal>R$ {total.toFixed(2)}</BottomBarTotal>
          </BottomBarInfo>
        </BottomBarRow>
        <ButtonRow>
          <Button fullWidth variant="secondary" size="md" onClick={cancelEdit}>
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
        </ButtonRow>
      </BottomBar>
      {toast}
    </>
  );
}
