// Libs
import { OrderStatus } from 'bp-core';
import type { Order, Session } from 'bp-core';
// Local
import { computeStats } from './rules';

jest.mock('bp-core', () => ({
  OrderStatus: { Sale: 'sale', Reservation: 'reservation' },
}));

function makeOrder(over: Partial<Order> = {}): Order {
  return {
    id: 'o1',
    customerName: 'Fulano',
    paymentMethod: 'cash',
    status: OrderStatus.Sale,
    total: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    delivered: false,
    stayForMeal: false,
    tickets: [],
    ...over,
  } as Order;
}

describe('computeStats', () => {
  const session = {
    id: 's1',
    date: '2026-01-01',
    ministry: 'Louvor',
    isOpen: true,
    status: 'open',
    dishes: [
      { id: 'd1', name: 'Feijoada', price: 20, totalTickets: 30, soldTickets: 0, availableAddons: [] },
      { id: 'd2', name: 'Yakisoba', price: 25, totalTickets: 10, soldTickets: 0, availableAddons: [] },
    ],
    orders: [
      makeOrder({
        id: 'sale1',
        status: OrderStatus.Sale,
        total: 40,
        tickets: [
          { dishId: 'd1', dishName: 'Feijoada', dishBasePrice: 20, totalPrice: 20, addons: [] },
          { dishId: 'd1', dishName: 'Feijoada', dishBasePrice: 20, totalPrice: 20, addons: [] },
        ],
      } as Partial<Order>),
      makeOrder({
        id: 'sale2',
        status: OrderStatus.Sale,
        total: 25,
        tickets: [{ dishId: 'd2', dishName: 'Yakisoba', dishBasePrice: 25, totalPrice: 25, addons: [] }],
      } as Partial<Order>),
      makeOrder({ id: 'res1', status: OrderStatus.Reservation, total: 20 }),
    ],
  } as Session;

  it('aggregates only sales into revenue, ticket and order counts', () => {
    const { stats } = computeStats(session);
    expect(stats).toEqual({
      totalTickets: 3,
      revenue: 65,
      confirmedOrders: 2,
      pendingReservations: 1,
    });
  });

  it('maps sold tickets per dish while keeping the dish capacity', () => {
    const { dishMap } = computeStats(session);
    expect(dishMap).toEqual([
      { name: 'Feijoada', sold: 2, total: 30 },
      { name: 'Yakisoba', sold: 1, total: 10 },
    ]);
  });
});
