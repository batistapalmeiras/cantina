import { useState } from 'react';
import { useSessionCtx } from '../../../hooks/useSession';
import { CashierTab, OrderStatus } from '../../../types';
import { Dish, Order, TicketItem } from '../../../types';
import { CashierFormValues } from '../validators/schema';
import { supabase } from '../../../lib/supabase';

type DishQty = { count: number; addonCounts: Record<string, number> };

export function useCashier() {
  const { session, addOrder, confirmReservation, cancelOrder } = useSessionCtx();
  const [tab, setTab] = useState<CashierTab>(CashierTab.Sale);
  const [quantities, setQuantities] = useState<Record<string, DishQty>>({});
  const [onSale, setOnSale] = useState(false);

  const getQ = (id: string): DishQty => quantities[id] ?? { count: 0, addonCounts: {} };

  const increment = (dish: Dish) => {
    const available = dish.totalTickets - dish.soldTickets;
    const q = getQ(dish.id);
    if (q.count >= available) return;
    setQuantities((prev) => ({ ...prev, [dish.id]: { ...q, count: q.count + 1 } }));
  };

  const decrement = (dishId: string) => {
    const q = getQ(dishId);
    if (q.count <= 0) return;
    const newCount = q.count - 1;
    const addonCounts = Object.fromEntries(
      Object.entries(q.addonCounts).map(([id, n]) => [id, Math.min(n, newCount)])
    );
    setQuantities((prev) => ({ ...prev, [dishId]: { count: newCount, addonCounts } }));
  };

  const setAddonCount = (dishId: string, addonId: string, count: number) => {
    const q = getQ(dishId);
    setQuantities((prev) => ({
      ...prev,
      [dishId]: { ...q, addonCounts: { ...q.addonCounts, [addonId]: Math.max(0, Math.min(count, q.count)) } },
    }));
  };

  const buildTickets = (): TicketItem[] => {
    const tickets: TicketItem[] = [];
    if (!session) return tickets;
    session.dishes.forEach((dish: Dish) => {
      const q = getQ(dish.id);
      for (let i = 0; i < q.count; i++) {
        const addons = dish.availableAddons.filter((a) => (q.addonCounts[a.id] ?? 0) > i);
        const addonTotal = addons.reduce((s, a) => s + (a.price ?? 0), 0);
        tickets.push({
          dishId: dish.id,
          dishName: dish.name,
          dishBasePrice: dish.price,
          addons,
          totalPrice: dish.price + addonTotal,
        });
      }
    });
    return tickets;
  };

  const tickets = buildTickets();
  const total = tickets.reduce((s, t) => s + t.totalPrice, 0);

  const handleConfirm = async (data: CashierFormValues) => {
    if (tickets.length === 0) return;

    if (data.clientId === '__new__') {
      await supabase.from('clients').insert({
        name: data.customerName.trim(),
        phone: data.customerPhone,
        created_at: new Date().toISOString(),
      });
    }

    addOrder({
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone,
      tickets,
      paymentMethod: data.paymentMethod,
      status: OrderStatus.Sale,
      total,
      confirmedAt: new Date().toISOString(),
    });
    setQuantities({});
    setOnSale(true);
    setTimeout(() => setOnSale(false), 100);
  };

  const reservations = session?.orders.filter((o: Order) => o.status === OrderStatus.Reservation) ?? [];
  const pendingCount = reservations.length;

  return {
    session,
    tab,
    setTab,
    quantities,
    tickets,
    total,
    onSale,
    reservations,
    pendingCount,
    increment,
    decrement,
    setAddonCount,
    handleConfirm,
    confirmReservation,
    cancelOrder,
  };
}
