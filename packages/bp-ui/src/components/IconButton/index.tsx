// React
import { forwardRef } from 'react';
// Local
import { IconWrap, StyledButton } from './styles';
import { IconButtonProps } from './types';

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, iconPosition = 'left', variant = 'primary', size = 'md', fullWidth = false, type = 'button', children, ...rest },
  ref,
) {
  const iconEl = <IconWrap $size={size}>{icon}</IconWrap>;
  const iconOnly = iconPosition === 'center';

  return (
    <StyledButton ref={ref} type={type} $variant={variant} $size={size} $fullWidth={fullWidth} $iconOnly={iconOnly} {...rest}>
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
});
