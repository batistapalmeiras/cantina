// Libs
import type { TicketItem } from 'bp-core';
// Local
import { groupTicketsForSummary, summarizeTicketsText } from './rules';

describe('groupTicketsForSummary', () => {
  it('groups by dish name with quantity and subtotal', () => {
    const tickets = [
      { dishName: 'Feijoada', totalPrice: 20 },
      { dishName: 'Feijoada', totalPrice: 25 },
      { dishName: 'Yakisoba', totalPrice: 30 },
    ] as TicketItem[];

    expect(groupTicketsForSummary(tickets)).toEqual([
      { name: 'Feijoada', qty: 2, subtotal: 45 },
      { name: 'Yakisoba', qty: 1, subtotal: 30 },
    ]);
  });
});

describe('summarizeTicketsText', () => {
  it('renders a "N× name" comma-separated line', () => {
    const tickets = [
      { dishName: 'Feijoada', totalPrice: 20 },
      { dishName: 'Feijoada', totalPrice: 20 },
      { dishName: 'Yakisoba', totalPrice: 30 },
    ] as TicketItem[];

    expect(summarizeTicketsText(tickets)).toBe('2× Feijoada, 1× Yakisoba');
  });
});
