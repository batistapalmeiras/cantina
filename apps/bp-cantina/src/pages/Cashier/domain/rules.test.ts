// Libs
import type { Dish, TicketItem } from 'bp-core';
import type { DishQuantity } from 'bp-ui';
// Local
import { buildTickets, computeTotal, groupTicketsForSummary, summarizeTicketsText } from './rules';

function dish(over: Partial<Dish> = {}): Dish {
  return {
    id: 'd1',
    name: 'Feijoada',
    price: 20,
    totalTickets: 30,
    soldTickets: 0,
    availableAddons: [],
    ...over,
  } as Dish;
}

describe('buildTickets', () => {
  it('expands one ticket per unit and applies addons to the first N units', () => {
    const dishes = [
      dish({ id: 'd1', name: 'Feijoada', price: 20, availableAddons: [{ id: 'a1', name: 'Farofa', price: 5 }] }),
    ];
    const quantities: Record<string, DishQuantity> = { d1: { count: 2, addonCounts: { a1: 1 } } };

    const tickets = buildTickets(dishes, quantities);

    expect(tickets).toHaveLength(2);
    // first unit gets the addon (count 1 > index 0), second does not (1 > 1 is false)
    expect(tickets[0]).toMatchObject({ dishName: 'Feijoada', totalPrice: 25, addons: [{ id: 'a1' }] });
    expect(tickets[1]).toMatchObject({ dishName: 'Feijoada', totalPrice: 20, addons: [] });
  });

  it('skips dishes with zero quantity', () => {
    const dishes = [dish({ id: 'd1' }), dish({ id: 'd2', name: 'Yakisoba' })];
    expect(buildTickets(dishes, { d1: { count: 0, addonCounts: {} } })).toEqual([]);
  });
});

describe('computeTotal', () => {
  it('sums ticket prices', () => {
    const tickets = [{ totalPrice: 20 }, { totalPrice: 25 }] as TicketItem[];
    expect(computeTotal(tickets)).toBe(45);
  });
});

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
