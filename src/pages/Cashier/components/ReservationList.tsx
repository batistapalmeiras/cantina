import styled from 'styled-components';
import { Order, PaymentMethod } from '../../../types';
import { Button } from '../../../components/Button';

interface Props {
  reservations: Order[];
  onConfirm: (orderId: string) => Promise<void>;
  onCancel: (orderId: string) => Promise<void>;
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.base};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: transparent;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CustomerName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

const CustomerPhone = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: ${({ theme }) => theme.typography.badge.fontWeight};
  background: #edf7f4;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primaryDisabled};
  flex-shrink: 0;
`;

const Meta = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.base};
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EmptyTitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

const EmptySub = styled.p`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

export function ReservationList({ reservations, onConfirm, onCancel }: Props) {
  if (reservations.length === 0) {
    return (
      <Empty>
        <EmptyTitle>Sem reservas pendentes</EmptyTitle>
        <EmptySub>Nenhuma reserva aguardando confirmação.</EmptySub>
      </Empty>
    );
  }

  return (
    <List>
      {reservations.map((order) => (
        <Card key={order.id}>
          <CardTop>
            <div>
              <CustomerName>{order.customerName}</CustomerName>
              {order.customerPhone && <CustomerPhone>{order.customerPhone}</CustomerPhone>}
            </div>
            <Badge>Reserva</Badge>
          </CardTop>
          <Meta>
            {order.tickets.length} fichinha{order.tickets.length !== 1 ? 's' : ''} · R$ {order.total.toFixed(2)} ·{' '}
            {order.paymentMethod === PaymentMethod.Pix ? 'Pix' : 'Dinheiro'}
          </Meta>
          <Actions>
            <Button variant="primary" size="sm" onClick={() => onConfirm(order.id)}>
              Confirmar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancel(order.id)}>
              Cancelar
            </Button>
          </Actions>
        </Card>
      ))}
    </List>
  );
}
