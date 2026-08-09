import { Dish, isPromoActive, TicketItem } from 'bp-core';

export interface DishSummary {
  name: string;
  qty: number;
}

/**
 * Groups tickets by dish name. When `dishes` is provided, marks groups whose
 * quantity qualifies for an active price-tier promotion.
 */
export function summarizeTickets(tickets: TicketItem[], dishes: Dish[] = []): DishSummary[] {
  const grouped = tickets.reduce<Record<string, DishSummary>>((acc, t) => {
    if (!acc[t.dishName]) acc[t.dishName] = { name: t.dishName, qty: 0 };
    acc[t.dishName].qty++;
    return acc;
  }, {});
  return Object.values(grouped).map((g) => {
    const dish = dishes.find((d) => d.name === g.name);
    if (dish && isPromoActive(dish, g.qty)) return { ...g, name: `${g.name} · promoção` };
    return g;
  });
}

export function summarizeTicketsText(tickets: TicketItem[]): string {
  return summarizeTickets(tickets)
    .map((g) => `${g.qty}× ${g.name}`)
    .join(', ');
}
