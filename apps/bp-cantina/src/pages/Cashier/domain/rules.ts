// Libs
import { Dish, TicketItem } from 'bp-core';
import { DishQuantity } from 'bp-ui';
// Local
import { GroupedTicket } from './types';

/** Expands the per-dish quantities into one ticket per unit (with its chosen addons). */
export function buildTickets(dishes: Dish[], quantities: Record<string, DishQuantity>): TicketItem[] {
  const tickets: TicketItem[] = [];
  dishes.forEach((dish) => {
    const q = quantities[dish.id] ?? { count: 0, addonCounts: {} };
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
}

export function computeTotal(tickets: TicketItem[]): number {
  return tickets.reduce((s, t) => s + t.totalPrice, 0);
}

/** Groups tickets by dish name, summing quantity and subtotal — shape consumed by SummaryCard. */
export function groupTicketsForSummary(tickets: TicketItem[]): GroupedTicket[] {
  const groups: Record<string, GroupedTicket> = {};
  for (const t of tickets) {
    if (!groups[t.dishName]) groups[t.dishName] = { name: t.dishName, qty: 0, subtotal: 0 };
    groups[t.dishName].qty++;
    groups[t.dishName].subtotal += t.totalPrice;
  }
  return Object.values(groups);
}

/** One-line "2× X, 1× Y" summary of the tickets. */
export function summarizeTicketsText(tickets: TicketItem[]): string {
  return groupTicketsForSummary(tickets)
    .map((g) => `${g.qty}× ${g.name}`)
    .join(', ');
}
