import { TicketItem } from 'bp-core';

export interface DishSummary {
  name: string;
  qty: number;
}

export function summarizeTickets(tickets: TicketItem[]): DishSummary[] {
  const grouped = tickets.reduce<Record<string, DishSummary>>((acc, t) => {
    if (!acc[t.dishName]) acc[t.dishName] = { name: t.dishName, qty: 0 };
    acc[t.dishName].qty++;
    return acc;
  }, {});
  return Object.values(grouped);
}

export function summarizeTicketsText(tickets: TicketItem[]): string {
  return summarizeTickets(tickets)
    .map((g) => `${g.qty}× ${g.name}`)
    .join(', ');
}
