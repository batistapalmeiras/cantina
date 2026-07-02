// React
import { ReactNode, SelectHTMLAttributes } from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';

export interface SelectProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  children: ReactNode;
  wrapperStyle?: React.CSSProperties;
}

export interface RawSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  wrapperStyle?: React.CSSProperties;
  error?: string;
}
