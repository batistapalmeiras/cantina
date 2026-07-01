// React
import React from 'react';
// Libs
import styled from 'styled-components';
// Components
import { fadeIn, fadeUp } from '../../styles/animations';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const Box = styled.div`
  background: ${({ theme }) => theme.colors.canvas};
  border-radius: ${({ theme }) => theme.rounded.lg};
  padding: 28px 32px;
  width: 100%;
  max-width: 60%;
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${fadeUp} 0.25s ease;

  @media (max-width: 480px) {
    max-width: 100%;
    margin-top: 35%;
    width: 100%;
    height: 100%;
    padding: 24px 20px;
    overflow-y: auto;
  }
`;

export const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.displaySm.fontSize};
  font-weight: ${({ theme }) => theme.typography.displaySm.fontWeight};
  color: ${({ theme }) => theme.colors.ink};
  margin-bottom: 24px;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 28px;
`;

interface Props {
  children: React.ReactNode;
  close: () => void;
}

export function Modal({ children, close }: Props) {
  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>
        {children}
      </Box>
    </Overlay>
  );
}
