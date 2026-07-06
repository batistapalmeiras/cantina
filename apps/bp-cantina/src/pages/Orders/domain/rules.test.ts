// Libs
import { OrderStatus } from 'bp-core';
import type { Dish, Order } from 'bp-core';
// Local
import { computeRemainingTickets, selectConfirmedOrders, selectPendingOrders } from './rules';

vi.mock('bp-core', () => ({
  OrderStatus: { Sale: 'sale', Reservation: 'reservation' },
}));

function makeOrder(id: string, status: Order['status']): Order {
  return {
    id,
    customerName: 'Fulano',
    paymentMethod: 'cash',
    status,
    total: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    delivered: false,
    stayForMeal: false,
    tickets: [],
  } as Order;
}

const orders = [
  makeOrder('a', OrderStatus.Sale),
  makeOrder('b', OrderStatus.Reservation),
  makeOrder('c', OrderStatus.Sale),
];

describe('order selectors', () => {
  it('selectConfirmedOrders returns only sales', () => {
    expect(selectConfirmedOrders(orders).map((o) => o.id)).toEqual(['a', 'c']);
  });

  it('selectPendingOrders returns only reservations', () => {
    expect(selectPendingOrders(orders).map((o) => o.id)).toEqual(['b']);
  });
});

describe('computeRemainingTickets', () => {
  it('sums capacity minus sold across dishes', () => {
    const dishes = [
      { id: 'd1', name: 'A', price: 0, totalTickets: 30, soldTickets: 10, availableAddons: [] },
      { id: 'd2', name: 'B', price: 0, totalTickets: 10, soldTickets: 4, availableAddons: [] },
    ] as Dish[];
    expect(computeRemainingTickets(dishes)).toBe(26);
  });

  it('returns 0 when there are no dishes', () => {
    expect(computeRemainingTickets([])).toBe(0);
  });
});
