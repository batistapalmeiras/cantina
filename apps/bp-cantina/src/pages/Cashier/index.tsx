// React
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
// Libs
import { PaymentMethod } from 'bp-core';
import {
  Button,
  formatCurrency,
  PageHeader,
  SummaryCard,
  Tab,
  TabBadge,
  TabBar,
  Typography,
  useToast,
} from 'bp-ui';
// Local
import { CashierDishSelector } from './components/DishSelector';
import { PaymentSection } from './components/PaymentSection';
import { ReservationList } from './components/ReservationList';
import { groupTicketsForSummary, summarizeTicketsText } from './domain';
import { useCashier } from './hooks';
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
import { CashierTab } from './types';
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
    orderError,
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

  useEffect(() => { if (onSale) showToast('✓ Venda registrada com sucesso'); }, [onSale, showToast]);
  useEffect(() => { if (orderError) showToast(orderError); }, [orderError, showToast]);

  const { control, handleSubmit, reset, setValue } = useForm<CashierFormValues>({
    resolver: zodResolver(cashierSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      clientId: '',
      paymentMethod: PaymentMethod.Cash,
      stayForMeal: false,
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
            <div>
              <CashierDishSelector
                control={control}
                setValue={setValue}
                dishes={session.dishes}
                quantities={quantities}
                onIncrement={increment}
                onDecrement={decrement}
                onSetAddonCount={setAddonCount}
              />
              <div style={{ marginTop: '24px' }}>
                <PaymentSection control={control} />
              </div>
            </div>
            <StickyAside>
              <SummaryCard
                items={groupTicketsForSummary(tickets)}
                total={total}
                onConfirm={handleSubmit(onSubmit)}
                confirmText="Confirmar venda"
              />
            </StickyAside>
          </Grid>

          {Object.values(quantities).some(q => q.count > 0) && (
            <BottomSummary>
              <BottomSummaryRow>
                <BottomSummaryInfo>
                  <BottomSummaryItems>{summarizeTicketsText(tickets)}</BottomSummaryItems>
                  <BottomSummaryTotal>{formatCurrency(total)}</BottomSummaryTotal>
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
