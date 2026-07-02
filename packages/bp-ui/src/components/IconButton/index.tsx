// Local
import { IconWrap, StyledButton } from './styles';
import { IconButtonProps } from './types';

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
