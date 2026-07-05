// React
import { InputHTMLAttributes } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

interface BaseFieldProps<T extends FieldValues, N extends FieldPath<T>> {
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
  mask?: 'phone';
}
