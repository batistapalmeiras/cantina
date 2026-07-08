// Libs
import { useSessionCtx } from 'bp-core';
// Local
import { selectConfirmedOrders, selectPendingOrders } from '../domain';
import { useOrdersList } from '../../../hooks/useOrdersList';

export function useOrders() {
  const { session, confirmReservation, cancelOrder, updateOrder } = useSessionCtx();

  const allOrders = session?.orders ?? [];

  const confirmed = selectConfirmedOrders(allOrders);
  const pending = selectPendingOrders(allOrders);

  const list = useOrdersList(allOrders, { nameFilter: true });

  return {
    session,
    confirmed,
    pending,
    ...list,
    confirmReservation,
    cancelOrder,
    updateOrder,
  };
}
