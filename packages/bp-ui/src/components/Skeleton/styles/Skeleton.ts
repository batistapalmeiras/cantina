// Libs
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

export const Skeleton = styled.div<{ $h?: string; $w?: string }>`
  height: ${({ $h }) => $h ?? '16px'};
  width: ${({ $w }) => $w ?? '100%'};
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.surfaceStrong};
  animation: ${pulse} 1.4s ease-in-out infinite;
`;
