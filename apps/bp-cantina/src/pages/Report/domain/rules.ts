// Components
import { OrderStatus,Session } from 'bp-core';
// Local
import { DishMapEntry,ReportStats } from './types';

export function computeStats(session: Session): { stats: ReportStats; dishMap: DishMapEntry[] } {
  const sales = session.orders.filter((o) => o.status === OrderStatus.Sale);
  const pending = session.orders.filter((o) => o.status === OrderStatus.Reservation);
  const totalTickets = sales.reduce((s, o) => s + o.tickets.length, 0);
  const revenue = sales.reduce((s, o) => s + o.total, 0);

  const dishMap: Record<string, DishMapEntry> = {};
  session.dishes.forEach((d) => { dishMap[d.id] = { name: d.name, sold: 0, total: d.totalTickets }; });
  sales.forEach((o) => { o.tickets.forEach((t) => { if (dishMap[t.dishId]) dishMap[t.dishId].sold++; }); });

  return {
    stats: { totalTickets, revenue, confirmedOrders: sales.length, pendingReservations: pending.length },
    dishMap: Object.values(dishMap),
  };
}
