import styled from 'styled-components';

export type StatusTone = 'success' | 'warning';

export interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
}

const StyledBadge = styled.span<{ $tone: StatusTone }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: 600;

  ${({ $tone, theme }) =>
    $tone === 'success'
      ? `background: ${theme.colors.successSurface}; color: ${theme.colors.success}; border: 1px solid ${theme.colors.successBorder};`
      : `background: ${theme.colors.warningSurface}; color: ${theme.colors.warning}; border: 1px solid ${theme.colors.warningBorder};`}
`;

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return <StyledBadge $tone={tone}>{children}</StyledBadge>;
}
