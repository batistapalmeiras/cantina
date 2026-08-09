// React
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { Addon, Dish, Order, OrderStatus, PaymentMethod, TicketItem, useSessionCtx, calculateTotalWithPixSurcharge, CHURCH_PIX_KEY, buildOrderTickets, computeOrderTotal } from 'bp-core';
import { DishQuantity } from 'bp-ui';
// Components
import { AppRoute } from '../../../routes/paths';

export function useEditReservation(orderId: string) {
  const { session, updateOrder } = useSessionCtx();
  const navigate = useNavigate();

  const [quantities, setQuantities] = useState<Record<string, DishQuantity>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Pix);
  const [stayForMeal, setStayForMeal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentOrder: Order | null = session?.orders?.find((o) => o.id === orderId) ?? null;
  const reservedByDish = (currentOrder?.tickets ?? []).reduce<Record<string, number>>((acc, t) => {
    acc[t.dishId] = (acc[t.dishId] ?? 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    if (initialized || !currentOrder || !session) return;
    const next: Record<string, DishQuantity> = {};
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
    setStayForMeal(currentOrder.stayForMeal);
    setInitialized(true);
  }, [currentOrder, session, initialized]);

  const getQ = (id: string): DishQuantity => quantities[id] ?? { count: 0, addonCounts: {} };

  const increment = (dish: Dish) => {
    const q = getQ(dish.id);
    // Disponível = capacidade global + o que o cliente já reservou deste prato (devolvido na edição).
    const available = dish.totalTickets - dish.soldTickets + (reservedByDish[dish.id] ?? 0);
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

  const saveReservation = useCallback(
    async (clientName: string, clientPhone: string, onSuccess?: () => void) => {
      if (!session || tickets.length === 0 || !currentOrder) return;
      setOrderError(null);
      setIsSaving(true);
      try {
        // Editar um pedido já confirmado exige nova confirmação da equipe — e,
        // como itens/valor podem ter mudado, um comprovante novo (se for Pix).
        const wasConfirmed = currentOrder.status === OrderStatus.Sale;

        // Atomic update in place (keeps the order id/created_at and adjusts the
        // ticket counters server-side) — replaces the old cancel + re-create.
        await updateOrder(currentOrder.id, {
          customerName: clientName,
          customerPhone: clientPhone || undefined,
          tickets,
          paymentMethod,
          total,
          stayForMeal,
          ...(wasConfirmed ? { status: OrderStatus.Reservation, receiptPath: null } : {}),
        });
        onSuccess?.();
        navigate(AppRoute.ReservationConfirmed, {
          state: { paymentMethod, total, pixKey: CHURCH_PIX_KEY, orderId: currentOrder.id },
        });
      } catch (err) {
        setOrderError(err instanceof Error ? err.message : 'Erro ao salvar reserva');
      } finally {
        setIsSaving(false);
      }
    },
    [session, tickets, paymentMethod, total, stayForMeal, currentOrder, updateOrder, navigate]
  );

  const cancelEdit = () => navigate(AppRoute.Reservation);

  return {
    session,
    currentOrder,
    quantities,
    reservedByDish,
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
