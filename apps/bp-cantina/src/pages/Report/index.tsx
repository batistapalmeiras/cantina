// Libs
import { Check, Download, X } from 'lucide-react';
import { Order, OrderStatus, PaymentMethod } from 'bp-core';
import {
  Button,
  Chip,
  ChipBar,
  Empty,
  formatCurrency,
  OrdersList,
  PageHeader,
  Skeleton,
} from 'bp-ui';
// Local
import { useReport } from './hooks';
import {
  Section, SectionLabel,
  StatCard, StatsGrid, StatValue,
} from './styles';

export function ReportPage() {
  const {
    session, orders, stats, loading, canResolveReservations,
    page, totalPages, filterStatus, filterPayment, hasFilter,
    setPage, handleFilterStatus, handleFilterPayment,
    confirmReservation, cancelOrder, downloadReport,
  } = useReport();

  const renderActions = canResolveReservations
    ? (order: Order) => order.status === OrderStatus.Reservation ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" onClick={() => confirmReservation(order.id)}>
            <Check size={16} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => cancelOrder(order.id)}>
            <X size={16} />
          </Button>
        </div>
      ) : null
    : undefined;

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
      <Empty
        title="Nenhuma sessão disponível"
        description="Aguarde o administrador abrir uma sessão"
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Relatório"
        subtitle={`${session.ministry} · ${new Date(session.date).toLocaleDateString('pt-BR')}`}
        back
        action={(
          <Button variant="secondary" size="sm" onClick={downloadReport}>
            <Download size={16} />
            Baixar Relatório
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
            <StatValue>{formatCurrency(stats.revenue)}</StatValue>
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
        />
      </Section>
    </>
  );
}
