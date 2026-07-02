// React
import { useNavigate } from 'react-router-dom';
// Libs
import { useSessionCtx } from 'bp-core';
import { Order, OrderStatus, PaymentMethod } from 'bp-core';
import { Button } from 'bp-ui';
import { Chip, ChipBar } from 'bp-ui';
import { OrdersList } from 'bp-ui';
import { PageHeader } from 'bp-ui';
import { Skeleton } from 'bp-ui';
import { Typography } from 'bp-ui';
import { useModal } from 'bp-ui';
import { Check, Pencil, X } from 'lucide-react';
// Components
import { AppRoute } from '../../routes/paths';
// Local
import { OrderEditForm } from './components/OrderEditForm';
import { useReport } from './hooks/useReport';
import {
BarCount,
BarFill, BarLabel,   BarRow, BarTrack, Empty,
IconBtn,   OrderActions,   Section, SectionLabel,
StatCard,   StatsGrid, StatValue,
} from './styles';

export function ReportPage() {
  const {
    session, orders, stats, dishMap, loading, isEditable, canEditSession,
    page, totalPages, filterStatus, filterPayment, hasFilter,
    setPage, handleFilterStatus, handleFilterPayment,
  } = useReport();
  const { confirmReservation, cancelOrder } = useSessionCtx();
  const { open, close, modal } = useModal();
  const navigate = useNavigate();

  if (loading) {
    return (
      <>
        <StatsGrid>
          {[1, 2, 3, 4].map((i) => (
            <StatCard key={i}>
              <Skeleton $h="12px" $w="60%" />
              <Skeleton $h="24px" $w="40%" style={{ marginTop: 10 }} />
            </StatCard>
          ))}
        </StatsGrid>
        <Section>
          <Skeleton $h="14px" $w="120px" style={{ marginBottom: 16 }} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} $h="40px" style={{ marginBottom: 8 }} />
          ))}
        </Section>
      </>
    );
  }

  if (!session) {
    return (
      <Empty>
        <Typography type="h3">Nenhuma sessão disponível</Typography>
        <Typography type="p">Abra uma sessão pelo Configurar para ver o relatório.</Typography>
      </Empty>
    );
  }

  const renderActions = isEditable ? (order: Order) => (
    <OrderActions>
      <IconBtn title="Editar" onClick={() => open(<OrderEditForm order={order} close={close} />)}>
        <Pencil size={14} />
      </IconBtn>
      {order.status === OrderStatus.Reservation && (
        <IconBtn $variant="success" title="Confirmar" onClick={() => confirmReservation(order.id)}>
          <Check size={14} />
        </IconBtn>
      )}
      <IconBtn $variant="danger" title="Cancelar" onClick={() => cancelOrder(order.id)}>
        <X size={14} />
      </IconBtn>
    </OrderActions>
  ) : undefined;

  return (
    <>
      <PageHeader
        title="Relatório"
        subtitle={`${session.ministry} · ${new Date(session.date).toLocaleDateString('pt-BR')}`}
        back
        action={canEditSession && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(AppRoute.EditSession)}
          >
            Editar sessão
          </Button>
        )}
      />

      {stats && (
        <StatsGrid>
          <StatCard>
            <label>Fichinhas vendidas</label>
            <StatValue>{stats.totalTickets}</StatValue>
          </StatCard>
          <StatCard>
            <label>Receita total</label>
            <StatValue>R$ {stats.revenue.toFixed(2)}</StatValue>
          </StatCard>
          <StatCard>
            <label>Pedidos confirmados</label>
            <StatValue>{stats.confirmedOrders}</StatValue>
          </StatCard>
          <StatCard>
            <label>Reservas pendentes</label>
            <StatValue $muted>{stats.pendingReservations}</StatValue>
          </StatCard>
        </StatsGrid>
      )}

      {dishMap && dishMap.length > 0 && (
        <Section>
          <SectionLabel>Fichinhas por prato</SectionLabel>
          {dishMap.map((d) => (
            <BarRow key={d.name}>
              <BarLabel>{d.name}</BarLabel>
              <BarTrack><BarFill $pct={d.total > 0 ? (d.sold / d.total) * 100 : 0} /></BarTrack>
              <BarCount>{d.sold}/{d.total}</BarCount>
            </BarRow>
          ))}
        </Section>
      )}

      <Section>
        <SectionLabel>Pedidos</SectionLabel>
        <ChipBar>
          <Chip $active={filterStatus === OrderStatus.Sale} onClick={() => handleFilterStatus(filterStatus === OrderStatus.Sale ? null : OrderStatus.Sale)}>Confirmado</Chip>
          <Chip $active={filterStatus === OrderStatus.Reservation} onClick={() => handleFilterStatus(filterStatus === OrderStatus.Reservation ? null : OrderStatus.Reservation)}>Pendente</Chip>
          <Chip $active={filterPayment === PaymentMethod.Pix} onClick={() => handleFilterPayment(filterPayment === PaymentMethod.Pix ? null : PaymentMethod.Pix)}>Pix</Chip>
          <Chip $active={filterPayment === PaymentMethod.Cash} onClick={() => handleFilterPayment(filterPayment === PaymentMethod.Cash ? null : PaymentMethod.Cash)}>Dinheiro</Chip>
        </ChipBar>
        <OrdersList
          orders={orders}
          page={page}
          totalPages={totalPages}
          hasFilter={hasFilter}
          onPageChange={setPage}
          renderActions={renderActions}
          renderSheetActions={isEditable ? (order, closeSheet) => (
            <OrderActions>
              <IconBtn title="Editar" onClick={() => { open(<OrderEditForm order={order} close={close} />); closeSheet(); }}>
                <Pencil size={14} /> Editar
              </IconBtn>
              {order.status === OrderStatus.Reservation && (
                <IconBtn $variant="success" title="Confirmar" onClick={() => { confirmReservation(order.id); closeSheet(); }}>
                  <Check size={14} /> Confirmar reserva
                </IconBtn>
              )}
              <IconBtn $variant="danger" title="Cancelar" onClick={() => { cancelOrder(order.id); closeSheet(); }}>
                <X size={14} /> Cancelar pedido
              </IconBtn>
            </OrderActions>
          ) : undefined}
        />
      </Section>

      {modal}
    </>
  );
}
