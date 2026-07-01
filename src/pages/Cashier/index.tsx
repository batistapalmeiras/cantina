import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { fadeUp } from '../../styles/animations';
import { useCashier } from './hooks/useCashier';
import { cashierSchema, CashierFormValues } from './validators/schema';
import { CashierTab, PaymentMethod } from '../../types';
import { Typography } from '../../components/Typography';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { CashierDishSelector } from './components/DishSelector';
import { OrderSummary } from './components/OrderSummary';
import { ReservationList } from './components/ReservationList';
import { useToast } from '../../components/Toast';
import { TabBar, Tab, TabBadge } from '../../components/Tabs';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding-bottom: 96px;
  }
`;

const StickyAside = styled.div`
  position: sticky;
  top: 80px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const BottomSummary = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    position: fixed;
    bottom: calc(64px + env(safe-area-inset-bottom));
    left: 0;
    right: 0;
    z-index: 90;
    background: ${({ theme }) => theme.colors.canvas};
    border-top: 1px solid ${({ theme }) => theme.colors.hairline};
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.base};
    animation: ${fadeUp} 0.2s ease;
  }
`;

const BottomSummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.base};
`;

const BottomSummaryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BottomSummaryLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BottomSummaryItems = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

const BottomSummaryTotal = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;


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
              reset={reset}
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

          {Object.values(quantities).some(q => q.count > 0) && <BottomSummary>
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
          </BottomSummary>}
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
