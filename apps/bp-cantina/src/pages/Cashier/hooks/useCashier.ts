// React
import { useState } from 'react';
// Libs
import { Dish, Order, OrderStatus, supabase, useSessionCtx, calculateTotalWithPixSurcharge } from 'bp-core';
import { DishQuantity } from 'bp-ui';
// Components
import { buildTickets, computeTotal } from '../domain';
import { CashierTab } from '../types';
import { CashierFormValues } from '../validators';
// Local
import { NEW_CLIENT_ID } from './useClientSearch';

export function useCashier() {
  const { session, addOrder, confirmReservation, cancelOrder } = useSessionCtx();
  const [tab, setTab] = useState<CashierTab>(CashierTab.Sale);
  const [quantities, setQuantities] = useState<Record<string, DishQuantity>>({});
  const [onSale, setOnSale] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const getQ = (id: string): DishQuantity => quantities[id] ?? { count: 0, addonCounts: {} };

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

  const tickets = session ? buildTickets(session.dishes, quantities) : [];
  const total = computeTotal(tickets);

  const handleConfirm = async (data: CashierFormValues) => {
    if (tickets.length === 0) return;

    setOrderError(null);
    try {
      if (data.clientId === NEW_CLIENT_ID) {
        const { error: clientError } = await supabase.from('clients').insert({
          name: data.customerName.trim(),
          phone: data.customerPhone,
          created_at: new Date().toISOString(),
        });
        if (clientError) throw clientError;
      }

      const finalTotal = calculateTotalWithPixSurcharge(total, data.paymentMethod);
      await addOrder({
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone,
        tickets,
        paymentMethod: data.paymentMethod,
        status: OrderStatus.Sale,
        total: finalTotal,
        stayForMeal: data.stayForMeal,
      });
      setQuantities({});
      setOnSale(true);
      setTimeout(() => setOnSale(false), 100);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Erro ao registrar venda');
    }
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
    orderError,
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
