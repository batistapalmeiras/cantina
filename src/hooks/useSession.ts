// React
import { useCallback, useContext, useEffect,useState } from 'react';
// Components
import { SessionContext, SessionContextValue } from '../contexts/SessionContext';
import { supabase } from '../lib/supabase';
import { Addon, Dish, Order, OrderStatus,Session, TicketItem } from '../types';

function mapSession(raw: any, dishes: Dish[], orders: Order[]): Session {
  return {
    id: raw.id,
    date: raw.date,
    ministry: raw.ministry,
    pixKey: raw.pix_key,
    isOpen: raw.is_open,
    status: raw.status ?? (raw.is_open ? 'open' : 'closed'),
    dishes,
    orders,
  };
}

function mapDish(raw: any, addons: Addon[]): Dish {
  return {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    totalTickets: raw.total_tickets,
    soldTickets: raw.sold_tickets,
    availableAddons: addons,
  };
}

function mapOrder(raw: any, tickets: TicketItem[]): Order {
  return {
    id: raw.id,
    customerName: raw.customer_name,
    customerPhone: raw.customer_phone ?? undefined,
    paymentMethod: raw.payment_method,
    status: raw.status,
    total: raw.total,
    createdAt: raw.created_at,
    confirmedAt: raw.confirmed_at ?? undefined,
    delivered: raw.delivered ?? false,
    tickets,
  };
}

function mapTicketItem(raw: any): TicketItem {
  return {
    dishId: raw.dish_id,
    dishName: raw.dish_name,
    dishBasePrice: raw.dish_base_price,
    totalPrice: raw.total_price,
    addons: raw.addons ?? [],
  };
}

export async function fetchAllSessions(): Promise<Array<{ id: string; date: string; ministry: string; isOpen: boolean }>> {
  const { data } = await supabase
    .from('sessions')
    .select('id, date, ministry, is_open')
    .order('date', { ascending: false });
  return (data ?? []).map((s: any) => ({ id: s.id, date: s.date, ministry: s.ministry, isOpen: s.is_open }));
}

export interface SessionsPageResult {
  data: Array<{ id: string; date: string; ministry: string; isOpen: boolean; status: 'open' | 'pending' | 'closed' }>;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchSessionsPage(page: number = 1, pageSize: number = 10): Promise<SessionsPageResult> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count } = await supabase
    .from('sessions')
    .select('id, date, ministry, is_open, status', { count: 'exact' })
    .order('date', { ascending: false })
    .range(from, to);

  const total = count || 0;
  return {
    data: (data ?? []).map((s: any) => ({ id: s.id, date: s.date, ministry: s.ministry, isOpen: s.is_open, status: s.status ?? (s.is_open ? 'open' : 'closed') })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function fetchSessionById(id: string): Promise<Session | null> {
  const { data: sessionRow, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !sessionRow) return null;

  const { data: dishRows } = await supabase
    .from('dishes')
    .select('*, addons(*)')
    .eq('session_id', sessionRow.id);

  const dishes: Dish[] = (dishRows ?? []).map((d: any) =>
    mapDish(d, (d.addons ?? []).map((a: any): Addon => ({ id: a.id, name: a.name, price: a.price })))
  );

  const { data: orderRows } = await supabase
    .from('orders')
    .select('*, ticket_items(*)')
    .eq('session_id', sessionRow.id)
    .order('created_at', { ascending: false });

  const orders: Order[] = (orderRows ?? []).map((o: any) =>
    mapOrder(o, (o.ticket_items ?? []).map(mapTicketItem))
  );

  return mapSession(sessionRow, dishes, orders);
}

export async function fetchPendingSession(): Promise<Session | null> {
  const { data: sessionRow, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !sessionRow) return null;

  const { data: dishRows } = await supabase
    .from('dishes')
    .select('*, addons(*)')
    .eq('session_id', sessionRow.id);

  const dishes: Dish[] = (dishRows ?? []).map((d: any) =>
    mapDish(d, (d.addons ?? []).map((a: any): Addon => ({ id: a.id, name: a.name, price: a.price })))
  );

  const { data: orderRows } = await supabase
    .from('orders')
    .select('*, ticket_items(*)')
    .eq('session_id', sessionRow.id)
    .order('created_at', { ascending: false });

  const orders: Order[] = (orderRows ?? []).map((o: any) =>
    mapOrder(o, (o.ticket_items ?? []).map(mapTicketItem))
  );

  return mapSession(sessionRow, dishes, orders);
}

export interface OrdersPageResult {
  orders: Order[];
  total: number;
  totalPages: number;
}

export async function fetchOrdersPage(
  sessionId: string,
  page: number,
  pageSize: number,
  filterStatus?: string | null,
  filterPayment?: string | null,
): Promise<OrdersPageResult> {
  let query = supabase
    .from('orders')
    .select('*, ticket_items(*)', { count: 'exact' })
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (filterStatus) query = query.eq('status', filterStatus);
  if (filterPayment) query = query.eq('payment_method', filterPayment);

  const { data, count } = await query;
  const total = count ?? 0;
  const orders: Order[] = (data ?? []).map((o: any) =>
    mapOrder(o, (o.ticket_items ?? []).map(mapTicketItem))
  );
  return { orders, total, totalPages: Math.ceil(total / pageSize) };
}

export async function fetchOpenSession(): Promise<Session | null> {
  const { data: sessionRow, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !sessionRow) return null;

  const { data: dishRows } = await supabase
    .from('dishes')
    .select('*, addons(*)')
    .eq('session_id', sessionRow.id);

  const dishes: Dish[] = (dishRows ?? []).map((d: any) =>
    mapDish(d, (d.addons ?? []).map((a: any): Addon => ({ id: a.id, name: a.name, price: a.price })))
  );

  const { data: orderRows } = await supabase
    .from('orders')
    .select('*, ticket_items(*)')
    .eq('session_id', sessionRow.id)
    .order('created_at', { ascending: false });

  const orders: Order[] = (orderRows ?? []).map((o: any) =>
    mapOrder(o, (o.ticket_items ?? []).map(mapTicketItem))
  );

  return mapSession(sessionRow, dishes, orders);
}

export function useSession(): SessionContextValue {
  const [session, setSession] = useState<Session | null>(null);
  const [pendingSession, setPendingSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [s, p] = await Promise.all([fetchOpenSession(), fetchPendingSession()]);
    setSession(s);
    setPendingSession(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!session?.id) return;

    const channel = supabase
      .channel(`session-${session.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        console.log('🔔 Realtime: Mudança em orders', payload);
        reload();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dishes' }, (payload) => {
        console.log('🔔 Realtime: Mudança em dishes', payload);
        reload();
      })
      .subscribe((status) => {
        console.log('📡 Realtime status:', status);
      });

    return () => { supabase.removeChannel(channel); };
  }, [session?.id, reload]);

  const openSession = useCallback(async (data: Omit<Session, 'id' | 'orders'>) => {
    const { data: sessionRow, error } = await supabase
      .from('sessions')
      .insert({ date: data.date, ministry: data.ministry, pix_key: data.pixKey, is_open: true })
      .select()
      .single();

    if (error || !sessionRow) throw error;

    for (const dish of data.dishes) {
      const { data: dishRow } = await supabase
        .from('dishes')
        .insert({ session_id: sessionRow.id, name: dish.name, price: dish.price, total_tickets: dish.totalTickets, sold_tickets: 0 })
        .select()
        .single();

      if (dishRow && dish.availableAddons.length > 0) {
        await supabase.from('addons').insert(
          dish.availableAddons.map((a) => ({ dish_id: dishRow.id, name: a.name, price: a.price ?? 0 }))
        );
      }
    }

    await reload();
  }, [reload]);

  const closeSession = useCallback(async () => {
    if (!session) return;
    const hasPending = session.orders.some(o => o.status === OrderStatus.Reservation);
    const newStatus = hasPending ? 'pending' : 'closed';
    await supabase.from('sessions').update({ is_open: false, status: newStatus }).eq('id', session.id);
    await reload();
  }, [session, reload]);


  const addOrder = useCallback(async (order: Omit<Order, 'id' | 'createdAt' | 'delivered'>) => {
    if (!session) return;

    const { data: orderRow, error } = await supabase
      .from('orders')
      .insert({
        session_id: session.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone ?? null,
        payment_method: order.paymentMethod,
        status: order.status,
        total: order.total,
        confirmed_at: order.confirmedAt ?? null,
      })
      .select()
      .single();

    if (error || !orderRow) throw error;

    await supabase.from('ticket_items').insert(
      order.tickets.map((t) => ({
        order_id: orderRow.id,
        dish_id: t.dishId,
        dish_name: t.dishName,
        dish_base_price: t.dishBasePrice,
        total_price: t.totalPrice,
        addons: t.addons,
      }))
    );

    for (const dish of session.dishes) {
      const count = order.tickets.filter((t) => t.dishId === dish.id).length;
      if (count > 0) {
        await supabase
          .from('dishes')
          .update({ sold_tickets: dish.soldTickets + count })
          .eq('id', dish.id);
      }
    }

    await reload();
  }, [session, reload]);

  const autoFinalizePending = useCallback(async (resolvedOrderId: string) => {
    if (!pendingSession) return;
    const remaining = pendingSession.orders.filter(
      (o) => o.id !== resolvedOrderId && o.status === OrderStatus.Reservation
    );
    if (remaining.length === 0) {
      await supabase.from('sessions').update({ status: 'closed' }).eq('id', pendingSession.id);
    }
  }, [pendingSession]);

  const confirmReservation = useCallback(async (orderId: string) => {
    if (!session) return;

    await supabase
      .from('orders')
      .update({ status: OrderStatus.Sale, confirmed_at: new Date().toISOString() })
      .eq('id', orderId);

    await autoFinalizePending(orderId);
    await reload();
  }, [session, reload, autoFinalizePending]);

  const cancelOrder = useCallback(async (orderId: string) => {
    if (!session) return;

    const order = session.orders.find((o) => o.id === orderId);
    if (order) {
      for (const dish of session.dishes) {
        const count = order.tickets.filter((t) => t.dishId === dish.id).length;
        if (count > 0) {
          await supabase
            .from('dishes')
            .update({ sold_tickets: Math.max(0, dish.soldTickets - count) })
            .eq('id', dish.id);
        }
      }
    }

    await supabase.from('ticket_items').delete().eq('order_id', orderId);
    await supabase.from('orders').delete().eq('id', orderId);

    await autoFinalizePending(orderId);
    await reload();
  }, [session, reload, autoFinalizePending]);

  const updateSession = useCallback(async (data: { ministry?: string; dishes?: Dish[] }) => {
    if (!session) return;

    if (data.ministry !== undefined) {
      await supabase.from('sessions').update({ ministry: data.ministry }).eq('id', session.id);
    }

    if (data.dishes) {
      for (const dish of data.dishes) {
        await supabase.from('dishes').update({
          name: dish.name,
          price: dish.price,
          total_tickets: dish.totalTickets,
        }).eq('id', dish.id);

        const originalAddonIds = session.dishes.find((d) => d.id === dish.id)?.availableAddons.map((a) => a.id) ?? [];
        const newAddons = dish.availableAddons.filter((a) => !a.id.includes('-'));
        const existingAddons = dish.availableAddons.filter((a) => a.id.includes('-'));

        const deletedIds = originalAddonIds.filter((id) => !existingAddons.some((a) => a.id === id));
        if (deletedIds.length > 0) {
          await supabase.from('addons').delete().in('id', deletedIds);
        }
        for (const addon of existingAddons) {
          await supabase.from('addons').update({ name: addon.name, price: addon.price ?? 0 }).eq('id', addon.id);
        }
        if (newAddons.length > 0) {
          await supabase.from('addons').insert(newAddons.map((a) => ({ dish_id: dish.id, name: a.name, price: a.price ?? 0 })));
        }
      }
    }

    await reload();
  }, [session, reload]);

  const updateOrder = useCallback(async (orderId: string, data: Partial<Pick<Order, 'customerName' | 'customerPhone' | 'paymentMethod' | 'tickets' | 'total'>>) => {
    if (!session) return;

    const updates: Record<string, unknown> = {};
    if (data.customerName !== undefined) updates.customer_name = data.customerName;
    if (data.customerPhone !== undefined) updates.customer_phone = data.customerPhone ?? null;
    if (data.paymentMethod !== undefined) updates.payment_method = data.paymentMethod;
    if (data.total !== undefined) updates.total = data.total;
    if (Object.keys(updates).length > 0) {
      await supabase.from('orders').update(updates).eq('id', orderId);
    }

    if (data.tickets !== undefined) {
      const order = session.orders.find((o) => o.id === orderId);
      if (order?.status === OrderStatus.Sale) {
        for (const dish of session.dishes) {
          const oldCount = order.tickets.filter((t) => t.dishId === dish.id).length;
          const newCount = data.tickets.filter((t) => t.dishId === dish.id).length;
          const diff = newCount - oldCount;
          if (diff !== 0) {
            await supabase.from('dishes')
              .update({ sold_tickets: Math.max(0, dish.soldTickets + diff) })
              .eq('id', dish.id);
          }
        }
      }
      await supabase.from('ticket_items').delete().eq('order_id', orderId);
      if (data.tickets.length > 0) {
        await supabase.from('ticket_items').insert(
          data.tickets.map((t) => ({
            order_id: orderId,
            dish_id: t.dishId,
            dish_name: t.dishName,
            dish_base_price: t.dishBasePrice,
            total_price: t.totalPrice,
            addons: t.addons,
          }))
        );
      }
    }

    await reload();
  }, [session, reload]);

  const toggleDelivered = useCallback(async (orderId: string, delivered: boolean) => {
    await supabase.from('orders').update({ delivered }).eq('id', orderId);
    await reload();
  }, [reload]);

  return { session, pendingSession, loading, openSession, closeSession, addOrder, confirmReservation, cancelOrder, updateSession, updateOrder, toggleDelivered };
}

export function useSessionCtx() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
