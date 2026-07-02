// Libs
import styled, { keyframes } from 'styled-components';
// Components
import { fadeUp } from '../../../styles/animations';

const fadeOut = keyframes`
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(8px); }
`;

export const ToastEl = styled.div<{ $leaving: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onDark};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  font-weight: 500;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.rounded.full};
  box-shadow: ${({ theme }) => theme.shadows.md};
  pointer-events: none;
  z-index: 500;
  word-wrap: break-word;
  text-align: center;
  animation: ${({ $leaving }) => ($leaving ? fadeOut : fadeUp)} 0.25s ease forwards;
`;
