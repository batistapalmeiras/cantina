// React
import { useEffect,useState } from 'react';
// Libs
import { supabase } from 'bp-core';
import { OrderStatus, PaymentMethod } from 'bp-core';
// Components
import { HistoryOrder } from '../domain';

export function useClientHistory(clientPhone?: string, currentSessionId?: string) {
  const [history, setHistory] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientPhone) return;

    setLoading(true);
    let ignore = false;

    let query = supabase
      .from('orders')
      .select('id, status, total, payment_method, created_at, ticket_items(dish_name), sessions(date)')
      .eq('customer_phone', clientPhone)
      .order('created_at', { ascending: false })
      .limit(30);

    if (currentSessionId) {
      query = query.neq('session_id', currentSessionId);
    }

    query.then(({ data }) => {
      // Guard against an out-of-order response for a previous phone/session.
      if (ignore) return;
      const mapped: HistoryOrder[] = (data ?? []).map((o) => ({
        id: o.id,
        status: o.status as OrderStatus,
        total: o.total,
        paymentMethod: o.payment_method as PaymentMethod,
        createdAt: o.created_at,
        dishes: (o.ticket_items ?? []).map((t) => t.dish_name),
        sessionDate: o.sessions?.date ?? '',
      }));
      setHistory(mapped);
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [clientPhone, currentSessionId]);

  return { history, loading };
}
