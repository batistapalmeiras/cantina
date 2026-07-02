// Libs
import styled, { keyframes } from 'styled-components';
// Components
import { fadeUp } from '../../../styles/animations';

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(8px); }
`;

export const ToastEl = styled.div<{ $leaving: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: fit-content;
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onDark};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 600;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.rounded.full};
  box-shadow: ${({ theme }) => theme.shadows.md};
  pointer-events: none;
  z-index: 9999;
  white-space: nowrap;
  text-align: center;
  animation: ${({ $leaving }) => ($leaving ? fadeOut : fadeUp)} 0.25s ease forwards;
`;
