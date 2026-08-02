// Libs
import { Check, Pencil, X } from 'lucide-react';
import { Button, Empty, PageHeader, useModal } from 'bp-kit';
import { OrdersList } from 'bp-ui';
import { Order, OrderStatus } from 'bp-core';
// Components
import { OrdersSearch } from '../../components/OrdersSearch';
import { OrderEditForm } from '../Report/components';
// Local
import { computeRemainingTickets } from './domain';
import { useOrders } from './hooks';
import {
  OrderActions,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
} from './styles';

export function OrdersPage() {
  const {
    session, confirmed, pending,
    orders, page, totalPages, nameFilter, hasFilter,
    setPage, handleNameFilter,
    confirmReservation, cancelOrder,
  } = useOrders();
  const { open, close, modal } = useModal();

  if (!session) {
    return (
      <Empty
        title="Nenhuma sessão aberta"
        description="Aguarde o administrador abrir uma sessão."
      />
    );
  }

  const remaining = computeRemainingTickets(session.dishes);

  const renderActions = (order: Order) => (
    <OrderActions>
      {order.status === OrderStatus.Reservation && (
        <Button variant="primary" size="sm" onClick={() => confirmReservation(order.id)}>
          <Check size={16} />
        </Button>
      )}
      <Button variant="secondary" size="sm" onClick={() => open(<OrderEditForm order={order} close={close} />)}>
        <Pencil size={16} />
      </Button>
      <Button variant="danger" size="sm" onClick={() => cancelOrder(order.id)}>
        <X size={16} />
      </Button>
    </OrderActions>
  );

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle={`${session.ministry} · ${new Date(session.date).toLocaleDateString('pt-BR')}`}
      />

      <StatsGrid>
        <StatCard>
          <StatLabel>Confirmados</StatLabel>
          <StatValue>{confirmed.length}</StatValue>
        </StatCard>
        <StatCard $tone={pending.length > 0 ? 'warning' : undefined}>
          <StatLabel>Pendentes</StatLabel>
          <StatValue $tone={pending.length > 0 ? 'warning' : undefined}>{pending.length}</StatValue>
        </StatCard>
        <StatCard $tone={remaining === 0 ? 'danger' : undefined}>
          <StatLabel>Fichinhas restantes</StatLabel>
          <StatValue $tone={remaining === 0 ? 'danger' : undefined}>{remaining}</StatValue>
        </StatCard>
      </StatsGrid>

      <OrdersSearch value={nameFilter} onChange={handleNameFilter} />

      <OrdersList
        orders={orders}
        page={page}
        totalPages={totalPages}
        hasFilter={hasFilter}
        onPageChange={setPage}
        renderActions={renderActions}
        renderSheetActions={(order, closeSheet) => (
          <OrderActions>
            {order.status === OrderStatus.Reservation && (
              <Button variant="primary" size="sm" onClick={() => { confirmReservation(order.id); closeSheet(); }}>
                <Check size={16} /> Confirmar reserva
              </Button>
            )}
            <Button variant="danger" size="sm" onClick={() => { cancelOrder(order.id); closeSheet(); }}>
              <X size={16} /> Cancelar pedido
            </Button>
            <Button variant="secondary" size="sm" onClick={() => { open(<OrderEditForm order={order} close={close} />); closeSheet(); }}>
              <Pencil size={16} /> Editar
            </Button>
          </OrderActions>
        )}
      />

      {modal}
    </div>
  );
}
