// Libs
import { OrderStatus } from 'bp-core';
import styled from 'styled-components';

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const HistoryItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const HistoryItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: 4px;
`;

export const HistoryItemSession = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ink};
`;

export const HistoryItemMeta = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

export const StatusBadge = styled.span<{ $status: OrderStatus }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.rounded.full};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: 600;

  ${({ $status }) =>
    $status === OrderStatus.Sale
      ? `background: #f0faf5; color: #1a7a4a; border: 1px solid #b6e8cf;`
      : `background: #fffbeb; color: #b45309; border: 1px solid #fde68a;`}
`;

export const HistoryEmpty = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;
