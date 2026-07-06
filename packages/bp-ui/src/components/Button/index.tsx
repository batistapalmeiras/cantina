// Local
import { StyledButton } from './styles';
import { ButtonProps } from './types';

export function Button({ variant = 'primary', size = 'md', fullWidth = false, type = 'button', children, ...rest }: ButtonProps) {
  return (
    <StyledButton type={type} $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
}
