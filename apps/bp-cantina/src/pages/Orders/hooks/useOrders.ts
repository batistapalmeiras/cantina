// Libs
import { useSessionCtx } from 'bp-core';
// Local
import { selectConfirmedOrders, selectPendingOrders } from '../domain';
import { useOrdersList } from '../../../hooks/useOrdersList';

export function useOrders() {
  const { session, pendingSession, confirmReservation, cancelOrder, updateOrder } = useSessionCtx();

  const activeSession = session ?? pendingSession;
  const allOrders = activeSession?.orders ?? [];

  const confirmed = selectConfirmedOrders(allOrders);
  const pending = selectPendingOrders(allOrders);

  const list = useOrdersList(allOrders, { nameFilter: true });

  return {
    session: activeSession,
    confirmed,
    pending,
    ...list,
    confirmReservation,
    cancelOrder,
    updateOrder,
  };
}
