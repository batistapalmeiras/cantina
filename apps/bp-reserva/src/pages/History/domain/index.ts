export * from './types';

export function uniqueDishesText(dishes: string[]): string {
  return [...new Set(dishes)].join(', ');
}
