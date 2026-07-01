// React
import { InputHTMLAttributes,ReactNode } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
// Local
import { Dish } from './interfaces';

// BaseInput
export interface IBaseInputProps {
  label: string;
  wrapperStyle?: React.CSSProperties;
  error?: string;
  children: ReactNode;
}

// TextInput
export interface BaseFieldProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  wrapperStyle?: React.CSSProperties;
  placeholder?: string;
}

export interface CurrencyFieldProps<T extends FieldValues, N extends FieldPath<T>>
  extends BaseFieldProps<T, N> {
  currency: true;
}

export interface TextFieldProps<T extends FieldValues, N extends FieldPath<T>>
  extends BaseFieldProps<T, N>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  currency?: false;
}

// Select
export interface SelectProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  children: ReactNode;
  wrapperStyle?: React.CSSProperties;
}

// DishSelector
// addonCounts[addonId] = número de fichinhas que levam esse adicional (atribuídas às primeiras N fichinhas)
export type DishQuantity = { count: number; addonCounts: Record<string, number> };

export interface DishSelectorProps {
  dishes: Dish[];
  quantities: Record<string, DishQuantity>;
  onIncrement: (dish: Dish) => void;
  onDecrement: (dishId: string) => void;
  onSetAddonCount: (dishId: string, addonId: string, count: number) => void;
}
