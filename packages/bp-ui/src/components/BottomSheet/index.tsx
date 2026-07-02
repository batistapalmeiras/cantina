// React
import React from 'react';
import { createPortal } from 'react-dom';
// Local
import { Content, Handle, Overlay, Sheet } from './styles';

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
