// Libs
import styled from 'styled-components';

export const Card = styled.div<{ $hoverable?: boolean }>`
  background: ${({ theme }) => theme.colors.canvas};
  border: 1px solid ${({ theme }) => theme.colors.hairline};
  border-radius: ${({ theme }) => theme.rounded.md};
  padding: ${({ theme }) => theme.spacing.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: ${({ $hoverable }) => ($hoverable ? 'box-shadow 0.2s, border-color 0.2s' : 'none')};

  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    &:hover {
      box-shadow: ${theme.shadows.lg};
      border-color: transparent;
    }
  `}
`;
