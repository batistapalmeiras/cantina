// Libs
import { OrderStatus } from 'bp-core';
import type { Order } from 'bp-core';
// Local
import { groupTicketsByDish, selectKitchenOrders, splitByDelivery } from './rules';

// bp-core is stubbed to just the OrderStatus enum: the rules use it as a value,
// while Order/Dish are type-only and erased at transpile time.
vi.mock('bp-core', () => ({
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

describe('selectKitchenOrders', () => {
  it('keeps only sales, dropping reservations', () => {
    const orders = [
      makeOrder({ id: 'a', status: OrderStatus.Sale }),
      makeOrder({ id: 'b', status: OrderStatus.Reservation }),
    ];
    expect(selectKitchenOrders(orders).map((o) => o.id)).toEqual(['a']);
  });
});

describe('splitByDelivery', () => {
  it('sorts pending oldest-first and delivered newest-first', () => {
    const orders = [
      makeOrder({ id: 'new', delivered: false, createdAt: '2026-01-02T00:00:00.000Z' }),
      makeOrder({ id: 'old', delivered: false, createdAt: '2026-01-01T00:00:00.000Z' }),
      makeOrder({ id: 'delA', delivered: true, createdAt: '2026-01-01T00:00:00.000Z' }),
      makeOrder({ id: 'delB', delivered: true, createdAt: '2026-01-03T00:00:00.000Z' }),
    ];
    const { pending, delivered } = splitByDelivery(orders);
    expect(pending.map((o) => o.id)).toEqual(['old', 'new']);
    expect(delivered.map((o) => o.id)).toEqual(['delB', 'delA']);
  });
});

describe('groupTicketsByDish', () => {
  it('groups identical dish + addons and counts them', () => {
    const order = makeOrder({
      tickets: [
        { dishId: 'd1', dishName: 'Feijoada', dishBasePrice: 20, totalPrice: 20, addons: [] },
        { dishId: 'd1', dishName: 'Feijoada', dishBasePrice: 20, totalPrice: 20, addons: [] },
        { dishId: 'd1', dishName: 'Feijoada', dishBasePrice: 20, totalPrice: 25, addons: [{ id: 'a1', name: 'Farofa', price: 5 }] },
      ],
    } as Partial<Order>);

    const groups = groupTicketsByDish(order);
    expect(groups).toEqual([
      { name: 'Feijoada', addons: '', count: 2 },
      { name: 'Feijoada', addons: 'Farofa', count: 1 },
    ]);
  });
});
