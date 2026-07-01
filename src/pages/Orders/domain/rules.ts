import { Order, OrderStatus, Dish } from '../../../types';

export function selectConfirmedOrders(orders: Order[]): Order[] {
  return orders.filter((o) => o.status === OrderStatus.Sale);
}

export function selectPendingOrders(orders: Order[]): Order[] {
  return orders.filter((o) => o.status === OrderStatus.Reservation);
}

export function computeRemainingTickets(dishes: Dish[]): number {
  const totalTickets = dishes.reduce((s, d) => s + d.totalTickets, 0);
  const soldTickets = dishes.reduce((s, d) => s + d.soldTickets, 0);
  return totalTickets - soldTickets;
}
