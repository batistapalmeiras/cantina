// React
import { useState } from 'react';
// Libs
import styled from 'styled-components';
// Components
import { Order, OrderStatus, PaymentMethod } from '../../types';
import { BottomSheet } from '../BottomSheet';
import { Pagination } from '../Pagination';
import { Typography } from '../Typography';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Sale]: 'Confirmado',
  [OrderStatus.Reservation]: 'Pendente',
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.Pix]: 'Pix',
  [PaymentMethod.Cash]: 'Dinheiro',
};

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};

  @media (max-width: 700px) { display: none; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};

  thead tr { border-bottom: 1px solid ${({ theme }) => theme.colors.hairline}; }

  th {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
    text-align: left;
    font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.muted};
    text-transform: uppercase;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }

  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
    transition: background 0.15s;
    &:last-child { border-bottom: none; }
    &:hover { background: ${({ theme }) => theme.colors.surfaceSoft}; }
  }

  td {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
    color: ${({ theme }) => theme.colors.ink};
    vertical-align: middle;
  }
`;

export const StatusBadge = styled.span<{ $status: OrderStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: ${({ theme }) => theme.typography.badge.fontWeight};
  background: ${({ $status }) => $status === OrderStatus.Sale ? '#f0faf5' : '#fffbeb'};
  color: ${({ $status }) => $status === OrderStatus.Sale ? '#1a7a4a' : '#b45309'};
  border: 1px solid ${({ $status }) => $status === OrderStatus.Sale ? '#b6e8cf' : '#fde68a'};
`;

const CardList = styled.div`
  display: none;

  @media (max-width: 700px) {
    display: block;
    border: 1px solid ${({ theme }) => theme.colors.hairline};
    border-radius: ${({ theme }) => theme.rounded.md};
    overflow: hidden;
  }
`;

const OrderCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.base}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};

  &:last-child { border-bottom: none; }
`;

const CardMain = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TicketCount = styled.span`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

const SheetCustomer = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 2px;
`;

const SheetMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SheetActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  button, a {
    width: 100%;
    justify-content: center;
    height: 48px;
    font-size: ${({ theme }) => theme.typography.buttonMd.fontSize};
  }
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.base};
  text-align: center;
`;

interface Props {
  orders: Order[];
  page: number;
  totalPages: number;
  hasFilter: boolean;
  onPageChange: (p: number) => void;
  renderActions?: (order: Order) => React.ReactNode;
  renderSheetActions?: (order: Order, close: () => void) => React.ReactNode;
}

export function OrdersList({ orders, page, totalPages, hasFilter, onPageChange, renderActions, renderSheetActions }: Props) {
  const [selected, setSelected] = useState<Order | null>(null);
  if (orders.length === 0) {
    return (
      <Empty>
        <Typography type="p">
          {hasFilter
            ? 'Nenhum pedido encontrado para os filtros aplicados.'
            : 'Nenhum pedido registrado ainda.'}
        </Typography>
      </Empty>
    );
  }

  return (
    <>
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Fichinhas</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th>Status</th>
              {renderActions && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                  {order.customerPhone && (
                    <div style={{ fontSize: 11, color: '#929292', marginTop: 1 }}>
                      {order.customerPhone}
                    </div>
                  )}
                </td>
                <td>{order.tickets.length}</td>
                <td style={{ fontWeight: 500 }}>R$ {order.total.toFixed(2)}</td>
                <td>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</td>
                <td><StatusBadge $status={order.status}>{ORDER_STATUS_LABEL[order.status]}</StatusBadge></td>
                {renderActions && <td>{renderActions(order)}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      <CardList>
        {orders.map((order) => (
          <OrderCard key={order.id} onClick={() => renderActions && setSelected(order)} style={{ cursor: renderActions ? 'pointer' : 'default' }}>
            <CardMain>
              <CardName>{order.customerName}</CardName>
              <CardMeta>
                <TicketCount>{order.tickets.length} fichinhas</TicketCount>
                {' · '}R$ {order.total.toFixed(2)} · {PAYMENT_METHOD_LABEL[order.paymentMethod]}
              </CardMeta>
            </CardMain>
            <StatusBadge $status={order.status}>{ORDER_STATUS_LABEL[order.status]}</StatusBadge>
          </OrderCard>
        ))}
      </CardList>

      {selected && renderActions && (
        <BottomSheet onClose={() => setSelected(null)}>
          <SheetCustomer>{selected.customerName}</SheetCustomer>
          <SheetMeta>
            {selected.tickets.length} fich. · R$ {selected.total.toFixed(2)} · {PAYMENT_METHOD_LABEL[selected.paymentMethod]} · <StatusBadge $status={selected.status}>{ORDER_STATUS_LABEL[selected.status]}</StatusBadge>
          </SheetMeta>
          <SheetActions onClick={() => setSelected(null)}>
            {renderSheetActions
              ? renderSheetActions(selected, () => setSelected(null))
              : renderActions(selected)}
          </SheetActions>
        </BottomSheet>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
