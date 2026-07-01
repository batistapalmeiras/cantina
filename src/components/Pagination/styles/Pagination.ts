// Libs
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.rounded.full};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.ink : theme.colors.hairline)};
  background: ${({ theme, $active }) => ($active ? theme.colors.ink : theme.colors.canvas)};
  color: ${({ theme, $active }) => ($active ? theme.colors.onDark : theme.colors.ink)};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme, $active }) => ($active ? theme.colors.ink : theme.colors.surfaceSoft)};
  }

  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;
