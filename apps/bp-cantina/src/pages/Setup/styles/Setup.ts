// Libs
import styled from 'styled-components';

export const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.hairlineSoft};
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
  color: ${({ theme }) => theme.colors.muted};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

export const SessionBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.base};
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};

  strong {
    font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
    font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
    color: ${({ theme }) => theme.colors.ink};
  }

  p {
    font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const HistoryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const HistoryItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.base};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: transparent;
  }
`;

export const HistoryItemMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

export const HistoryItemTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMd.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
`;

export const HistoryItemSub = styled.span`
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
`;

export const HistoryBadge = styled.span<{ $status: 'open' | 'pending' | 'closed' }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.rounded.full};
  font-size: ${({ theme }) => theme.typography.badge.fontSize};
  font-weight: ${({ theme }) => theme.typography.badge.fontWeight};

  ${({ $status, theme }) =>
    $status === 'open'
      ? `background: ${theme.colors.primary}; color: ${theme.colors.onPrimary};`
      : $status === 'pending'
      ? `background: #fffbeb; color: #b45309; border: 1px solid #fde68a;`
      : `background: ${theme.colors.surfaceStrong}; color: ${theme.colors.muted};`}
`;

export const PendingAlert = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  svg { flex-shrink: 0; color: #b45309; margin-top: 2px; }
`;

export const PendingAlertBody = styled.div`
  flex: 1;

  strong {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.caption.fontSize};
    font-weight: 600;
    color: #92400e;
    display: block;
    margin-bottom: 4px;
  }

  p {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
    color: #b45309;
    line-height: 1.4;
  }
`;
