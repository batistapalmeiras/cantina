// React
import { ButtonHTMLAttributes } from 'react';
// Local
import { StyledButton } from './styles';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({ variant = 'primary', size = 'md', fullWidth = false, children, ...rest }: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
}
