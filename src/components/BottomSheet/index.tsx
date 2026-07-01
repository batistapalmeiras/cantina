// React
import React from 'react';
import { createPortal } from 'react-dom';
// Libs
import styled from 'styled-components';
// Components
import { fadeIn, slideUp } from '../../styles/animations';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease;
`;

const Sheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background: ${({ theme }) => theme.colors.canvas};
  border-radius: 20px 20px 0 0;
  padding-bottom: env(safe-area-inset-bottom);
  animation: ${slideUp} 0.28s cubic-bezier(0.32, 0.72, 0, 1);
`;

const Handle = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.hairline};
  margin: 12px auto 0;
`;

const Content = styled.div`
  padding: 20px ${({ theme }) => theme.spacing.base} ${({ theme }) => theme.spacing.lg};
`;

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export function BottomSheet({ children, onClose }: Props) {
  return createPortal(
    <>
      <Overlay onClick={onClose} />
      <Sheet>
        <Handle />
        <Content>{children}</Content>
      </Sheet>
    </>,
    document.body,
  );
}
