// React
import { ButtonHTMLAttributes } from 'react';

export type Variant = 'primary' | 'secondary' | 'danger';
export type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}
