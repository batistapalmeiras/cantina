// React
import { useNavigate } from 'react-router-dom';
// Libs
import { OrderStatus, PaymentMethod } from 'bp-core';
import { Button } from 'bp-ui';
import { Chip, ChipBar } from 'bp-ui';
import { formatCurrency } from 'bp-ui';
import { OrdersList } from 'bp-ui';
import { PageHeader } from 'bp-ui';
import { Skeleton } from 'bp-ui';
import { Typography } from 'bp-ui';
// Components
import { AppRoute } from '../../routes/paths';
// Local
import { useReport } from './hooks/useReport';
import {
  Empty,
  Section, SectionLabel,
  StatCard, StatsGrid, StatValue,
} from './styles';

export function ReportPage() {
  const {
    session, orders, stats, loading, canEditSession,
    page, totalPages, filterStatus, filterPayment, hasFilter,
    setPage, handleFilterStatus, handleFilterPayment,
  } = useReport();
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
        <Typography type="p">Aguarde o administrador abrir uma sessão</Typography>
      </Empty>
    );
  }

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
        />
      </Section>
    </>
  );
}
