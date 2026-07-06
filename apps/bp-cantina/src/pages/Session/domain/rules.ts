// Libs
import { Dish } from 'bp-core';

export function newId(): string {
  return crypto.randomUUID();
}

export function createDefaultDishes(): Dish[] {
  return [{ id: newId(), name: '', price: 0, totalTickets: 30, soldTickets: 0, availableAddons: [] }];
}
