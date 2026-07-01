// React
import { useMemo } from 'react';
// Components
import { useSessionCtx } from '../../../hooks/useSession';
import { selectKitchenOrders, splitByDelivery } from '../domain';

export function useKitchen() {
  const { session, pendingSession, toggleDelivered } = useSessionCtx();
  const activeSession = session ?? pendingSession;

  const { pending, delivered } = useMemo(() => {
    const confirmedOrders = selectKitchenOrders(activeSession?.orders ?? []);
    return splitByDelivery(confirmedOrders);
  }, [activeSession]);

  return {
    session: activeSession,
    pending,
    delivered,
    toggleDelivered,
  };
}
