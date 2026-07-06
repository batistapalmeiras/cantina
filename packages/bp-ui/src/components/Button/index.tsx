// React
import { forwardRef } from 'react';
// Local
import { StyledButton } from './styles';
import { ButtonProps } from './types';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, type = 'button', children, ...rest },
  ref,
) {
  return (
    <StyledButton ref={ref} type={type} $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
});
