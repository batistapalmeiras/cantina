import { useState } from 'react';
import styled from 'styled-components';
import { Order, OrderStatus, TicketItem, Dish } from '../../../types';
import { DishQuantity } from '../../../types/Inputs';
import { useSessionCtx } from '../../../hooks/useSession';
import { Button } from '../../../components/Button';
import { ModalTitle, ModalActions } from '../../../components/Modal';
import { DishSelector } from '../../../components/Inputs';

interface Props {
  order: Order;
  close: () => void;
}

type Quantities = Record<string, DishQuantity>;

function initQuantities(order: Order): Quantities {
  return order.tickets.reduce<Quantities>((acc, t) => {
    if (!acc[t.dishId]) acc[t.dishId] = { count: 0, addonCounts: {} };
    acc[t.dishId].count++;
    t.addons.forEach((a) => { acc[t.dishId].addonCounts[a.id] = (acc[t.dishId].addonCounts[a.id] ?? 0) + 1; });
    return acc;
  }, {});
}

const ClientCard = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
`;

const ClientName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodyMd.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

const ClientPhone = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

export function OrderEditForm({ order, close }: Props) {
  const { session, updateOrder } = useSessionCtx();
  const [quantities, setQuantities] = useState<Quantities>(() => initQuantities(order));
  const [saving, setSaving] = useState(false);

  if (!session) return null;

  const adjustedDishes: Dish[] = session.dishes.map((dish) => {
    if (order.status === OrderStatus.Sale) {
      const existing = order.tickets.filter((t) => t.dishId === dish.id).length;
      return { ...dish, soldTickets: Math.max(0, dish.soldTickets - existing) };
    }
    return dish;
  });

  const increment = (dish: Dish) => {
    setQuantities((q) => {
      const curr = q[dish.id] ?? { count: 0, addonCounts: {} };
      return { ...q, [dish.id]: { ...curr, count: curr.count + 1 } };
    });
  };

  const decrement = (dishId: string) => {
    setQuantities((q) => {
      const curr = q[dishId] ?? { count: 0, addonCounts: {} };
      if (curr.count === 0) return q;
      const newCount = curr.count - 1;
      const addonCounts = Object.fromEntries(
        Object.entries(curr.addonCounts).map(([id, n]) => [id, Math.min(n, newCount)])
      );
      return { ...q, [dishId]: { count: newCount, addonCounts } };
    });
  };

  const setAddonCount = (dishId: string, addonId: string, count: number) => {
    setQuantities((q) => {
      const curr = q[dishId] ?? { count: 0, addonCounts: {} };
      return { ...q, [dishId]: { ...curr, addonCounts: { ...curr.addonCounts, [addonId]: Math.max(0, Math.min(count, curr.count)) } } };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const newTickets: TicketItem[] = [];
      for (const dish of adjustedDishes) {
        const q = quantities[dish.id] ?? { count: 0, addonCounts: {} };
        for (let i = 0; i < q.count; i++) {
          const selectedAddons = dish.availableAddons.filter((a) => (q.addonCounts[a.id] ?? 0) > i);
          const addonTotal = selectedAddons.reduce((s, a) => s + a.price, 0);
          newTickets.push({
            dishId: dish.id,
            dishName: dish.name,
            dishBasePrice: dish.price,
            totalPrice: dish.price + addonTotal,
            addons: selectedAddons,
          });
        }
      }
      const total = newTickets.reduce((s, t) => s + t.totalPrice, 0);
      await updateOrder(order.id, { tickets: newTickets, total });
      close();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ModalTitle>Editar pedido</ModalTitle>

      <ClientCard>
        <ClientName>{order.customerName}</ClientName>
        {order.customerPhone && <ClientPhone>{order.customerPhone}</ClientPhone>}
      </ClientCard>

      <DishSelector
        dishes={adjustedDishes}
        quantities={quantities}
        onIncrement={increment}
        onDecrement={decrement}
        onSetAddonCount={setAddonCount}
      />

      <ModalActions>
        <Button variant="secondary" size="md" onClick={close}>Cancelar</Button>
        <Button variant="primary" size="md" onClick={save} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </ModalActions>
    </div>
  );
}
