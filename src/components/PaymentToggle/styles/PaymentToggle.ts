// Libs
import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const Toggle = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.sm};
  overflow: hidden;
`;

export const Btn = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.buttonSm.fontSize};
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background 0.15s, color 0.15s;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.ink : theme.colors.canvas)};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.onDark : theme.colors.muted)};

  & + & { border-left: 1px solid ${({ theme }) => theme.colors.hairline}; }
  &:hover { background: ${({ theme, $selected }) => ($selected ? theme.colors.ink : theme.colors.surfaceSoft)}; }
`;
