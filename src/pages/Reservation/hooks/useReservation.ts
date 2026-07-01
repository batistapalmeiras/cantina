// React
import { useCallback, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Components
import { useSessionCtx } from '../../../hooks/useSession';
import { AppRoute } from '../../../routes/paths';
import { Dish,Order, OrderStatus, PaymentMethod, TicketItem } from '../../../types';
import { ReservationFormValues } from '../validators';

export function useReservation(clientPhone?: string) {
  const { session, addOrder, cancelOrder } = useSessionCtx();
  const navigate = useNavigate();

  type DishQty = { count: number; addonCounts: Record<string, number> };
  const [quantities, setQuantities] = useState<Record<string, DishQty>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Pix);
  const [initialized, setInitialized] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const clientOrder: Order | null = clientPhone
    ? (session?.orders ?? []).find(
        (o) => o.customerPhone === clientPhone && o.status === OrderStatus.Reservation
      ) ?? null
    : null;

  useEffect(() => {
    if (initialized || !clientOrder || !session) return;
    const next: Record<string, DishQty> = {};
    clientOrder.tickets.forEach((t) => {
      const cur = next[t.dishId] ?? { count: 0, addonCounts: {} };
      const addonCounts = { ...cur.addonCounts };
      t.addons.forEach((a) => { addonCounts[a.id] = (addonCounts[a.id] ?? 0) + 1; });
      next[t.dishId] = { count: cur.count + 1, addonCounts };
    });
    setQuantities(next);
    setPaymentMethod(clientOrder.paymentMethod);
    setInitialized(true);
  }, [clientOrder, session, initialized]);

  const resetForm = () => {
    setQuantities({});
    setPaymentMethod(PaymentMethod.Pix);
    setInitialized(false);
  };

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
        tickets.push({ dishId: dish.id, dishName: dish.name, dishBasePrice: dish.price, addons, totalPrice: dish.price + addonTotal });
      }
    });
    return tickets;
  };

  const tickets = buildTickets();
  const total = tickets.reduce((s, t) => s + t.totalPrice, 0);

  const submitReservation = useCallback(async (data: ReservationFormValues) => {
    if (!session || tickets.length === 0) return;
    setOrderError(null);
    try {
      await addOrder({
        customerName: data.name.trim(),
        customerPhone: data.phone.trim() || undefined,
        tickets,
        paymentMethod,
        status: OrderStatus.Reservation,
        total,
      });
      navigate(AppRoute.ReservationSuccess, {
        state: { paymentMethod, total },
      });
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Erro ao registrar reserva');
    }
  }, [session, tickets, paymentMethod, total, addOrder, navigate]);

  const saveReservation = useCallback(async (clientName: string, clientPhoneVal: string) => {
    if (!session || tickets.length === 0 || !clientOrder) return;
    setOrderError(null);
    try {
      await cancelOrder(clientOrder.id);
      await addOrder({
        customerName: clientName,
        customerPhone: clientPhoneVal || undefined,
        tickets,
        paymentMethod,
        status: OrderStatus.Reservation,
        total,
      });
      navigate(AppRoute.ReservationSuccess, {
        state: { paymentMethod, total },
      });
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Erro ao salvar reserva');
    }
  }, [session, tickets, paymentMethod, total, clientOrder, addOrder, cancelOrder, navigate]);

  const cancelReservation = async () => {
    if (!clientOrder) return;
    await cancelOrder(clientOrder.id);
    resetForm();
  };

  return {
    session,
    quantities,
    paymentMethod,
    setPaymentMethod,
    tickets,
    total,
    clientOrder,
    orderError,
    increment,
    decrement,
    setAddonCount,
    submitReservation,
    saveReservation,
    cancelReservation,
  };
}
