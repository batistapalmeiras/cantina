// React
import { useState } from 'react';
// Libs
import { ORDER_STATUS_LABEL, Order, PAYMENT_METHOD_LABEL } from 'bp-core';
// Components
import { formatCurrency } from '../../utils/mask';
import { BottomSheet } from '../BottomSheet';
import { Pagination } from '../Pagination';
import { Typography } from '../Typography';
// Local
import {
  CardList,
  CardMain,
  CardMeta,
  CardName,
  Empty,
  OrderCard,
  SheetActions,
  SheetCustomer,
  SheetMeta,
  StatusBadge,
  Table,
  TableWrap,
  TicketCount,
} from './styles';


interface Props {
  orders: Order[];
  page: number;
  totalPages: number;
  hasFilter: boolean;
  onPageChange: (p: number) => void;
  renderActions?: (order: Order) => React.ReactNode;
  renderSheetActions?: (order: Order, close: () => void) => React.ReactNode;
}

export function OrdersList({
  orders,
  page,
  totalPages,
  hasFilter,
  onPageChange,
  renderActions,
  renderSheetActions,
}: Props) {
  const [selected, setSelected] = useState<Order | null>(null);

  if (orders.length === 0) {
    return (
      <Empty>
        <Typography type="p">
          {hasFilter ? 'Nenhum pedido encontrado para os filtros aplicados.' : 'Nenhum pedido registrado ainda.'}
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
                    <div style={{ fontSize: 11, color: '#929292', marginTop: 1 }}>{order.customerPhone}</div>
                  )}
                </td>
                <td>{order.tickets.length}</td>
                <td style={{ fontWeight: 500 }}>{formatCurrency(order.total)}</td>
                <td>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</td>
                <td>
                  <StatusBadge $status={order.status}>{ORDER_STATUS_LABEL[order.status]}</StatusBadge>
                </td>
                {renderActions && <td>{renderActions(order)}</td>}
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>

      <CardList>
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            onClick={() => renderActions && setSelected(order)}
            style={{ cursor: renderActions ? 'pointer' : 'default' }}
          >
            <CardMain>
              <CardName>{order.customerName}</CardName>
              <CardMeta>
                <TicketCount>{order.tickets.length} fichinhas</TicketCount>
                {' · '}{formatCurrency(order.total)} · {PAYMENT_METHOD_LABEL[order.paymentMethod]}
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
            {selected.tickets.length} fich. · {formatCurrency(selected.total)} · {PAYMENT_METHOD_LABEL[selected.paymentMethod]} ·{' '}
            <StatusBadge $status={selected.status}>{ORDER_STATUS_LABEL[selected.status]}</StatusBadge>
          </SheetMeta>
          <SheetActions onClick={() => setSelected(null)}>
            {renderSheetActions ? renderSheetActions(selected, () => setSelected(null)) : renderActions(selected)}
          </SheetActions>
        </BottomSheet>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
