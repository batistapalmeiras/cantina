import { Order, OrderStatus } from '../../../types';
import { GroupedItem } from './types';

export function selectKitchenOrders(orders: Order[]): Order[] {
  return orders.filter((o) => o.status === OrderStatus.Sale);
}

export function splitByDelivery(orders: Order[]): { pending: Order[]; delivered: Order[] } {
  const pending = orders
    .filter((o) => !o.delivered)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const delivered = orders
    .filter((o) => o.delivered)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { pending, delivered };
}

export function groupTicketsByDish(order: Order): GroupedItem[] {
  const groups: Record<string, GroupedItem> = {};
  for (const t of order.tickets) {
    const addonsLabel = t.addons.map((a) => a.name).join(', ');
    const key = `${t.dishName}__${addonsLabel}`;
    if (!groups[key]) groups[key] = { name: t.dishName, addons: addonsLabel, count: 0 };
    groups[key].count++;
  }
  return Object.values(groups);
}
