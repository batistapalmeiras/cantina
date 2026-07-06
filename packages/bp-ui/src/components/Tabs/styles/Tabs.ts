// Libs
import styled from 'styled-components';

export const TabBar = styled.div.attrs({ role: 'tablist' })`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.hairline};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Tab = styled.button.attrs<{ $active: boolean }>(({ $active }) => ({
  type: 'button',
  role: 'tab',
  'aria-selected': $active,
}))<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.buttonMd.fontSize};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.ink : theme.colors.muted)};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.ink : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;

  &:hover { color: ${({ theme }) => theme.colors.ink}; }
`;

export const TabBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: ${({ theme }) => theme.rounded.full};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
`;
