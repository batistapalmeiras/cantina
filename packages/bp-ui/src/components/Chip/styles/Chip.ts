// Libs
import styled from 'styled-components';

export const ChipBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} 0;
`;

export const Chip = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.rounded.full};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.hairline)};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.muted)};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.captionSm.fontSize};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme, $active }) => ($active ? theme.colors.onPrimary : theme.colors.primary)};
  }
`;
