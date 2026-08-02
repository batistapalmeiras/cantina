// Libs
import { Check, Download, X } from 'lucide-react';
import { Order, OrderStatus } from 'bp-core';
import { Button, Empty, formatCurrency, PageHeader, Skeleton } from 'bp-kit';
import { OrdersList } from 'bp-ui';
// Components
import { OrdersSearch } from '../../components/OrdersSearch';
// Local
import { useReport } from './hooks';
import {
  Section, SectionLabel,
  StatCard, StatsGrid, StatValue,
} from './styles';

export function ReportPage() {
  const {
    session, orders, stats, loading, canResolveReservations,
    page, totalPages, nameFilter, hasFilter,
    setPage, handleNameFilter,
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
        <OrdersSearch value={nameFilter} onChange={handleNameFilter} />
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
