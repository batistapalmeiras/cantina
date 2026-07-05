// React
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { Dish, OrderStatus, PaymentMethod, TicketItem, useSessionCtx, calculateTotalWithPixSurcharge } from 'bp-core';
// Components
import { AppRoute } from '../../../routes/paths';

interface ReservationFormValues {
  name: string;
  phone: string;
}

const CHURCH_PIX_KEY = '16886715000123';

type DishQty = { count: number; addonCounts: Record<string, number> };

export function useReservation() {
  const { session, addOrder, cancelOrder } = useSessionCtx();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<Record<string, DishQty>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Pix);
  const [stayForMeal, setStayForMeal] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const submitReservation = useCallback(
    async (data: ReservationFormValues, onSuccess?: () => void) => {
      if (!session || tickets.length === 0) return;
      setOrderError(null);
      setIsSaving(true);
      try {
        await addOrder({
          customerName: data.name.trim(),
          customerPhone: data.phone.trim() || undefined,
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
        setOrderError(err instanceof Error ? err.message : 'Erro ao registrar reserva');
      } finally {
        setIsSaving(false);
      }
    },
    [session, tickets, paymentMethod, total, addOrder, navigate]
  );

  const cancelReservation = async (orderId: string) => {
    await cancelOrder(orderId);
  };

  return {
    session,
    quantities,
    paymentMethod,
    setPaymentMethod,
    stayForMeal,
    setStayForMeal,
    tickets,
    total,
    orderError,
    isSaving,
    increment,
    decrement,
    setAddonCount,
    submitReservation,
    cancelReservation,
  };
}
