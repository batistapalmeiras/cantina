// React
import { useMemo } from 'react';
// Components
import { useSessionCtx } from 'bp-core';
import { selectKitchenOrders, splitByDelivery } from '../domain';

export function useKitchen() {
  const { session, toggleDelivered } = useSessionCtx();

  const { pending, delivered } = useMemo(() => {
    const confirmedOrders = selectKitchenOrders(session?.orders ?? []);
    return splitByDelivery(confirmedOrders);
  }, [session]);

  return {
    session,
    pending,
    delivered,
    toggleDelivered,
  };
}
