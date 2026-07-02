// Local
import { StyledButton } from './styles';
import { ButtonProps } from './types';

export function Button({ variant = 'primary', size = 'md', fullWidth = false, children, ...rest }: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
}
