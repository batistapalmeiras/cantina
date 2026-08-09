// Libs
import { Dish, isPromoActive, TicketItem } from 'bp-core';
// Local
import { GroupedTicket } from './types';

/**
 * Groups tickets by dish name, summing quantity and subtotal — shape consumed
 * by SummaryCard. When `dishes` is provided, marks groups whose quantity
 * qualifies for an active price-tier promotion.
 */
export function groupTicketsForSummary(tickets: TicketItem[], dishes: Dish[] = []): GroupedTicket[] {
  const groups: Record<string, GroupedTicket> = {};
  for (const t of tickets) {
    if (!groups[t.dishName]) groups[t.dishName] = { name: t.dishName, qty: 0, subtotal: 0 };
    groups[t.dishName].qty++;
    groups[t.dishName].subtotal += t.totalPrice;
  }
  return Object.values(groups).map((g) => {
    const dish = dishes.find((d) => d.name === g.name);
    if (dish && isPromoActive(dish, g.qty)) return { ...g, name: `${g.name} · promoção` };
    return g;
  });
}

/** One-line "2× X, 1× Y" summary of the tickets. */
export function summarizeTicketsText(tickets: TicketItem[]): string {
  return groupTicketsForSummary(tickets)
    .map((g) => `${g.qty}× ${g.name}`)
    .join(', ');
}
