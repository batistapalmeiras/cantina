import styled from 'styled-components';
import { ModalTitle } from '../../../components/Modal';
import { HistoryOrder } from '../hooks/useClientHistory';
import { OrderStatus, PaymentMethod } from '../../../types';

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.Pix]: 'Pix',
  [PaymentMethod.Cash]: 'Dinheiro',
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Sale]: 'Confirmado',
  [OrderStatus.Reservation]: 'Pendente',
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-height: 60vh;
  overflow-y: auto;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-right: 4px;
`;

const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: 4px;
`;

const ItemSession = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

const ItemMeta = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const StatusBadge = styled.span<{ $status: OrderStatus }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: 600;

  ${({ $status }) =>
    $status === OrderStatus.Sale
      ? `background: #f0faf5; color: #1a7a4a; border: 1px solid #b6e8cf;`
      : `background: #fffbeb; color: #b45309; border: 1px solid #fde68a;`}
`;

const Empty = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

interface Props {
  history: HistoryOrder[];
  loading: boolean;
}

export function HistoryModal({ history, loading }: Props) {
  return (
    <div>
      <ModalTitle>Histórico de pedidos</ModalTitle>
      {loading ? (
        <Empty>Carregando...</Empty>
      ) : history.length === 0 ? (
        <Empty>Nenhum pedido em domingos anteriores.</Empty>
      ) : (
        <List>
          {history.map((o) => (
            <Item key={o.id}>
              <ItemHeader>
                <div>
                  <ItemSession>
                    {o.sessionMinistry} · {new Date(o.sessionDate).toLocaleDateString('pt-BR')}
                  </ItemSession>
                  <ItemMeta>
                    {o.dishes.filter((d, i, arr) => arr.indexOf(d) === i).join(', ')}
                    {' · '}R$ {o.total.toFixed(2)} · {PAYMENT_LABEL[o.paymentMethod]}
                  </ItemMeta>
                </div>
                <StatusBadge $status={o.status}>{STATUS_LABEL[o.status]}</StatusBadge>
              </ItemHeader>
            </Item>
          ))}
        </List>
      )}
    </div>
  );
}
