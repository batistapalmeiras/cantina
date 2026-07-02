// React
import { ReactNode } from 'react';
import { Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';

export interface IBaseInputProps {
  label: string;
  wrapperStyle?: React.CSSProperties;
  error?: string;
  children: ReactNode;
}

export interface ControlledBaseProps<T extends FieldValues, N extends FieldPath<T>> {
  label: string;
  control: Control<T>;
  name: N;
  wrapperStyle?: React.CSSProperties;
  children: (field: ControllerRenderProps<T, N>, error?: string) => React.ReactNode;
}
