import { OrderStatus } from 'bp-core';
import styled from 'styled-components';

export interface StatusBadgeProps {
  status: OrderStatus;
  children: React.ReactNode;
}

const StyledBadge = styled.span<{ $status: OrderStatus }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: 600;

  ${({ $status, theme }) =>
    $status === OrderStatus.Sale
      ? `background: ${theme.colors.successSurface}; color: ${theme.colors.success}; border: 1px solid ${theme.colors.successBorder};`
      : `background: ${theme.colors.warningSurface}; color: ${theme.colors.warning}; border: 1px solid ${theme.colors.warningBorder};`}
`;

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return <StyledBadge $status={status}>{children}</StyledBadge>;
}
