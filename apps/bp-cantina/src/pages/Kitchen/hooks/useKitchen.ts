// React
import { useMemo } from 'react';
// Components
import { useSessionCtx } from 'bp-core';
import { splitByDelivery } from '../domain';

export function useKitchen() {
  const { session, toggleDelivered } = useSessionCtx();

  const { pending, delivered } = useMemo(() => {
    return splitByDelivery(session?.orders ?? []);
  }, [session]);

  return {
    session,
    pending,
    delivered,
    toggleDelivered,
  };
}
