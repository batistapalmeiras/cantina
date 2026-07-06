// React
import { ButtonHTMLAttributes, ReactNode } from 'react';
// Components
import { ButtonSize, ButtonVariant } from '../../_shared/buttonBase';

export type Variant = ButtonVariant;
export type Size = ButtonSize;
export type IconPosition = 'left' | 'center' | 'right';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  iconPosition?: IconPosition;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}
