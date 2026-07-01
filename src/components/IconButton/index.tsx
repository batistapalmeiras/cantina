// React
import { ButtonHTMLAttributes, ReactNode } from 'react';
// Local
import { IconWrap, StyledButton } from './styles';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'xs' | 'sm' | 'md' | 'lg';
type IconPosition = 'left' | 'center' | 'right';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  iconPosition?: IconPosition;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function IconButton({
  icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...rest
}: IconButtonProps) {
  const iconEl = <IconWrap $size={size}>{icon}</IconWrap>;
  const iconOnly = iconPosition === 'center';

  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} $iconOnly={iconOnly} {...rest}>
      {iconOnly ? (
        iconEl
      ) : (
        <>
          {iconPosition === 'left' && iconEl}
          {children}
          {iconPosition === 'right' && iconEl}
        </>
      )}
    </StyledButton>
  );
}
