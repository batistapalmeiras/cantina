// React
import React, { useEffect, useRef } from 'react';
// Local
import { Box, Overlay } from './styles';
export { ModalActions, ModalTitle } from './styles';

interface Props {
  children: React.ReactNode;
  close: () => void;
}

export function Modal({ children, close }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [close]);

  return (
    <Overlay onClick={close}>
      <Box ref={boxRef} role="dialog" aria-modal="true" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        {children}
      </Box>
    </Overlay>
  );
}
