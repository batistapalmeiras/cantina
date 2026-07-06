// React
import { ButtonHTMLAttributes } from 'react';
// Components
import { ButtonVariant } from '../../_shared/buttonBase';

export type Variant = ButtonVariant;
export type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}
