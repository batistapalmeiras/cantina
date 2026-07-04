// Libs
import { Dish } from 'bp-core';

export type DishQuantity = { count: number; addonCounts: Record<string, number> };

export interface DishSelectorProps {
  dishes: Dish[];
  quantities: Record<string, DishQuantity>;
  onIncrement: (dish: Dish) => void;
  onDecrement: (dishId: string) => void;
  onSetAddonCount: (dishId: string, addonId: string, count: number) => void;
  label: string;
}
