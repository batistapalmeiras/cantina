// React
import React from 'react';
// Local
import { Box, Overlay } from './styles';
export { ModalActions, ModalTitle } from './styles';

interface Props {
  children: React.ReactNode;
  close: () => void;
}

export function Modal({ children, close }: Props) {
  return (
    <Overlay onClick={close}>
      <Box onClick={(e) => e.stopPropagation()}>{children}</Box>
    </Overlay>
  );
}
