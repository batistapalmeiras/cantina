// Libs
import styled from 'styled-components';

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const StatCard = styled.div<{ $tone?: 'warning' | 'danger' }>`
  background: ${({ $tone }) =>
    $tone === 'warning' ? '#fffbeb' : $tone === 'danger' ? '#fff0f3' : 'transparent'};
  border: 1px solid ${({ theme, $tone }) =>
    $tone === 'warning' ? '#fde68a' : $tone === 'danger' ? '#ffd1da' : theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.sm};
`;

export const StatLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const StatValue = styled.p<{ $tone?: 'warning' | 'danger' }>`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme, $tone }) =>
    $tone === 'warning' ? '#b45309' : $tone === 'danger' ? '#c0002a' : theme.colors.ink};
`;

export const OrderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;
