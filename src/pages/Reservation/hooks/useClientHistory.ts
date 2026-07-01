import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { OrderStatus, PaymentMethod } from '../../../types';

export interface HistoryOrder {
  id: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  dishes: string[];
  sessionDate: string;
  sessionMinistry: string;
}

export function useClientHistory(clientPhone?: string, currentSessionId?: string) {
  const [history, setHistory] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientPhone) return;

    setLoading(true);

    let query = supabase
      .from('orders')
      .select('id, status, total, payment_method, created_at, ticket_items(dish_name), sessions(date, ministry)')
      .eq('customer_phone', clientPhone)
      .order('created_at', { ascending: false })
      .limit(30);

    if (currentSessionId) {
      query = query.neq('session_id', currentSessionId);
    }

    query.then(({ data }) => {
      const mapped: HistoryOrder[] = (data ?? []).map((o: any) => ({
        id: o.id,
        status: o.status,
        total: o.total,
        paymentMethod: o.payment_method,
        createdAt: o.created_at,
        dishes: (o.ticket_items ?? []).map((t: any) => t.dish_name as string),
        sessionDate: o.sessions?.date ?? '',
        sessionMinistry: o.sessions?.ministry ?? '',
      }));
      setHistory(mapped);
      setLoading(false);
    });
  }, [clientPhone, currentSessionId]);

  return { history, loading };
}
