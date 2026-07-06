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

export const HistoryEmpty = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;
