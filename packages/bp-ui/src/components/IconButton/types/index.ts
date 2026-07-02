// React
import { ButtonHTMLAttributes, ReactNode } from 'react';

export type Variant = 'primary' | 'secondary' | 'danger';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
export type IconPosition = 'left' | 'center' | 'right';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  iconPosition?: IconPosition;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}
