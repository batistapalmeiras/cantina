// React
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
// Components
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { Tab, TabBadge,TabBar } from '../../components/Tabs';
import { useToast } from '../../components/Toast';
import { Typography } from '../../components/Typography';
import { CashierTab, PaymentMethod } from '../../types';
// Local
import { CashierDishSelector } from './components/DishSelector';
import { OrderSummary } from './components/OrderSummary';
import { ReservationList } from './components/ReservationList';
import { useCashier } from './hooks/useCashier';
import {
  BottomSummary,
  BottomSummaryInfo,
  BottomSummaryItems,
  BottomSummaryRow,
  BottomSummaryTotal,
  EmptyState,
  Grid,
  StickyAside,
} from './styles';
import { CashierFormValues,cashierSchema } from './validators';

export function CashierPage() {
  const {
    session,
    tab,
    setTab,
    quantities,
    tickets,
    total,
    onSale,
    reservations,
    pendingCount,
    increment,
    decrement,
    setAddonCount,
    handleConfirm,
    confirmReservation,
    cancelOrder,
  } = useCashier();

  const { show: showToast, toast } = useToast();

  useEffect(() => { if (onSale) showToast('✓ Venda registrada com sucesso'); }, [onSale]);

  const { control, handleSubmit, reset, setValue } = useForm<CashierFormValues>({
    resolver: zodResolver(cashierSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      clientId: '',
      paymentMethod: PaymentMethod.Cash,
    },
  });

  const onSubmit = (data: CashierFormValues) => {
    handleConfirm(data);
    reset();
  };

  if (!session || !session.isOpen) {
    return (
      <EmptyState>
        <Typography type="h3">Nenhuma sessão ativa</Typography>
        <Typography type="p">Peça ao administrador para abrir a sessão pelo Configurar.</Typography>
      </EmptyState>
    );
  }

  return (
    <div>
      <PageHeader
        title="Caixa"
        subtitle={`${session.ministry} · ${new Date(session.date).toLocaleDateString('pt-BR')}`}
      />

      <TabBar>
        <Tab $active={tab === CashierTab.Sale} onClick={() => setTab(CashierTab.Sale)}>
          Nova venda
        </Tab>
        <Tab $active={tab === CashierTab.Reservations} onClick={() => setTab(CashierTab.Reservations)}>
          Reservas
          {pendingCount > 0 && <TabBadge>{pendingCount}</TabBadge>}
        </Tab>
      </TabBar>

      {tab === CashierTab.Sale && (
        <>
          <Grid>
            <CashierDishSelector
              control={control}
              setValue={setValue}
              dishes={session.dishes}
              quantities={quantities}
              onIncrement={increment}
              onDecrement={decrement}
              onSetAddonCount={setAddonCount}
            />
            <StickyAside>
              <OrderSummary
                control={control}
                tickets={tickets}
                total={total}
                onConfirm={handleSubmit(onSubmit)}
              />
            </StickyAside>
          </Grid>

          {Object.values(quantities).some(q => q.count > 0) && (
            <BottomSummary>
              <BottomSummaryRow>
                <BottomSummaryInfo>
                  <BottomSummaryItems>
                    {Object.values(
                      tickets.reduce<Record<string, { name: string; qty: number }>>((acc, t) => {
                        if (!acc[t.dishName]) acc[t.dishName] = { name: t.dishName, qty: 0 };
                        acc[t.dishName].qty++;
                        return acc;
                      }, {})
                    ).map((g) => `${g.qty}× ${g.name}`).join(', ')}
                  </BottomSummaryItems>
                  <BottomSummaryTotal>R$ {total.toFixed(2)}</BottomSummaryTotal>
                </BottomSummaryInfo>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ flexShrink: 0 }}
                  onClick={handleSubmit(onSubmit)}
                  disabled={tickets.length === 0}
                >
                  Confirmar venda
                </Button>
              </BottomSummaryRow>
            </BottomSummary>
          )}
        </>
      )}

      {tab === CashierTab.Reservations && (
        <ReservationList
          reservations={reservations}
          onConfirm={confirmReservation}
          onCancel={cancelOrder}
        />
      )}

      {toast}
    </div>
  );
}
