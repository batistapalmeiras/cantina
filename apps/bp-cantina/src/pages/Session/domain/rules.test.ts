// Local
import { createDefaultDishes, newId } from './rules';

// createDefaultDishes references the Dish type only (erased); no bp-core runtime
// value is used, so no mock is needed here.

describe('newId', () => {
  it('returns a non-empty string', () => {
    expect(newId()).toEqual(expect.any(String));
    expect(newId().length).toBeGreaterThan(0);
  });

  it('produces distinct ids across calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => newId()));
    expect(ids.size).toBe(50);
  });
});

describe('createDefaultDishes', () => {
  it('returns a single blank dish with 30 tickets and a generated id', () => {
    const dishes = createDefaultDishes();
    expect(dishes).toHaveLength(1);
    expect(dishes[0]).toMatchObject({
      name: '',
      price: 0,
      totalTickets: 30,
      soldTickets: 0,
      availableAddons: [],
    });
    expect(dishes[0].id).toEqual(expect.any(String));
  });

  it('generates a fresh id on each call', () => {
    expect(createDefaultDishes()[0].id).not.toBe(createDefaultDishes()[0].id);
  });
});
