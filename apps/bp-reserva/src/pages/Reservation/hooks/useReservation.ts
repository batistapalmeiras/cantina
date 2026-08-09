// React
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { Dish, OrderStatus, PaymentMethod, useSessionCtx, calculateTotalWithPixSurcharge, CHURCH_PIX_KEY, buildOrderTickets, computeOrderTotal } from 'bp-core';
import { DishQuantity } from 'bp-ui';
// Components
import { AppRoute } from '../../../routes/paths';

interface ReservationFormValues {
  name: string;
  phone: string;
}

export function useReservation() {
  const { session, addOrder, cancelOrder } = useSessionCtx();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<Record<string, DishQuantity>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Pix);
  const [stayForMeal, setStayForMeal] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const tickets = session ? buildOrderTickets(session.dishes, quantities) : [];
  const baseTotal = computeOrderTotal(tickets);
  const total = calculateTotalWithPixSurcharge(baseTotal, paymentMethod);

  const submitReservation = useCallback(
    async (data: ReservationFormValues, onSuccess?: () => void) => {
      if (!session || tickets.length === 0) return;
      setOrderError(null);
      setIsSaving(true);
      try {
        const orderId = await addOrder({
          customerName: data.name.trim(),
          customerPhone: data.phone.trim() || undefined,
          tickets,
          paymentMethod,
          status: OrderStatus.Reservation,
          total,
          stayForMeal,
        });
        onSuccess?.();
        navigate(AppRoute.ReservationConfirmed, {
          state: { paymentMethod, total, pixKey: CHURCH_PIX_KEY, orderId },
        });
      } catch (err) {
        setOrderError(err instanceof Error ? err.message : 'Erro ao registrar reserva');
      } finally {
        setIsSaving(false);
      }
    },
    [session, tickets, paymentMethod, total, stayForMeal, addOrder, navigate]
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
