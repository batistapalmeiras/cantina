// Libs
import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Card = styled.div<{ $done?: boolean }>`
  border: 1px solid ${({ theme, $done }) => ($done ? theme.colors.hairlineSoft : theme.colors.hairline)};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.base};
  background: ${({ theme, $done }) => ($done ? theme.colors.surfaceSoft : theme.colors.canvas)};
  opacity: ${({ $done }) => ($done ? 0.7 : 1)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CustomerName = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.titleMd.fontSize};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
`;

export const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemRow = styled.li`
  display: flex;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.body};
`;

export const ItemQty = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  min-width: 22px;
`;

export const ItemAddons = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;

export const EmptyHint = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

