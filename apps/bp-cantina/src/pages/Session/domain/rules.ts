// Components
import { Dish } from 'bp-core';

export function newId(): string {
  return Math.random().toString(36).slice(2);
}

export function createDefaultDishes(): Dish[] {
  return [{ id: newId(), name: '', price: 0, totalTickets: 30, soldTickets: 0, availableAddons: [] }];
}
