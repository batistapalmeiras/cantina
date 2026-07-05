// React
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { Addon, Dish, Order, OrderStatus, PaymentMethod, TicketItem, useSessionCtx, calculateTotalWithPixSurcharge } from 'bp-core';
// Components
import { AppRoute } from '../../../routes/paths';

const CHURCH_PIX_KEY = '16886715000123';

type DishQty = { count: number; addonCounts: Record<string, number> };

export function useEditReservation(orderId: string) {
  const { session, cancelOrder, addOrder } = useSessionCtx();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<Record<string, DishQty>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Pix);
  const [stayForMeal, setStayForMeal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentOrder: Order | null = session?.orders?.find((o) => o.id === orderId) ?? null;

  useEffect(() => {
    if (initialized || !currentOrder || !session) return;
    const next: Record<string, DishQty> = {};
    currentOrder.tickets.forEach((t: TicketItem) => {
      const cur = next[t.dishId] ?? { count: 0, addonCounts: {} };
      const addonCounts = { ...cur.addonCounts };
      t.addons.forEach((a: Addon) => {
        addonCounts[a.id] = (addonCounts[a.id] ?? 0) + 1;
      });
      next[t.dishId] = { count: cur.count + 1, addonCounts };
    });
    setQuantities(next);
    setPaymentMethod(currentOrder.paymentMethod);
    setInitialized(true);
  }, [currentOrder, session, initialized]);

  const getQ = (id: string): DishQty => quantities[id] ?? { count: 0, addonCounts: {} };

  const increment = (dish: Dish) => {
    const q = getQ(dish.id);
    // In edit mode, allow user to modify their own reservation even if globally sold out
    // available = global available + what user already has reserved
    const available = dish.totalTickets - dish.soldTickets + q.count;
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
    session.dishes.forEach((dish) => {
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
  const baseTotal = tickets.reduce((s, t) => s + t.totalPrice, 0);
  const total = calculateTotalWithPixSurcharge(baseTotal, paymentMethod);

  const saveReservation = useCallback(
    async (clientName: string, clientPhone: string, onSuccess?: () => void) => {
      if (!session || tickets.length === 0 || !currentOrder) return;
      setOrderError(null);
      setIsSaving(true);
      try {
        await cancelOrder(currentOrder.id);
        await addOrder({
          customerName: clientName,
          customerPhone: clientPhone || undefined,
          tickets,
          paymentMethod,
          status: OrderStatus.Reservation,
          total,
        });
        onSuccess?.();
        navigate(AppRoute.ReservationConfirmed, {
          state: { paymentMethod, total, pixKey: CHURCH_PIX_KEY },
        });
      } catch (err) {
        setOrderError(err instanceof Error ? err.message : 'Erro ao salvar reserva');
      } finally {
        setIsSaving(false);
      }
    },
    [session, tickets, paymentMethod, stayForMeal, total, currentOrder, addOrder, cancelOrder, navigate]
  );

  const cancelEdit = () => navigate(AppRoute.Reservation);

  return {
    session,
    currentOrder,
    quantities,
    paymentMethod,
    setPaymentMethod,
    stayForMeal,
    setStayForMeal,
    tickets,
    baseTotal,
    total,
    orderError,
    isSaving,
    increment,
    decrement,
    setAddonCount,
    saveReservation,
    cancelEdit,
  };
}
