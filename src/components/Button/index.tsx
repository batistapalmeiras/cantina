import styled, { css } from 'styled-components';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: css`
    height: 36px;
    padding: 0 ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.buttonSm.fontSize};
    font-weight: ${({ theme }) => theme.typography.buttonSm.fontWeight};
  `,
  md: css`
    height: 44px;
    padding: 0 ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.buttonMd.fontSize};
    font-weight: ${({ theme }) => theme.typography.buttonMd.fontWeight};
  `,
  lg: css`
    height: 52px;
    padding: 0 ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.typography.buttonMd.fontSize};
    font-weight: ${({ theme }) => theme.typography.buttonMd.fontWeight};
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: none;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryActive};
    }

    &:disabled {
      background: ${({ theme }) => theme.colors.primaryDisabled};
      cursor: not-allowed;
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.canvas};
    color: ${({ theme }) => theme.colors.ink};
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceSoft};
    }

    &:disabled {
      color: ${({ theme }) => theme.colors.mutedSoft};
      border-color: ${({ theme }) => theme.colors.hairline};
      cursor: not-allowed;
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.canvas};
    color: ${({ theme }) => theme.colors.primaryErrorText};
    border: 1px solid ${({ theme }) => theme.colors.primaryErrorText};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryErrorText};
      color: ${({ theme }) => theme.colors.onPrimary};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
};

const StyledButton = styled.button<{ $variant: Variant; $size: Size; $fullWidth: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.rounded.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s;
  white-space: nowrap;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.canvas}, 0 0 0 4px ${({ theme }) => theme.colors.ink};
  }
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $size }) => sizeStyles[$size as Size]}
  ${({ $variant }) => variantStyles[$variant as Variant]}
`;

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
}
