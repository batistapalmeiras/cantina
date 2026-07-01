import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { fadeUp } from '../../styles/animations';

const fadeOut = keyframes`
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(8px); }
`;

const ToastEl = styled.div<{ $leaving: boolean }>`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
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
  white-space: nowrap;
  animation: ${({ $leaving }) => ($leaving ? fadeOut : fadeUp)} 0.25s ease forwards;
`;

interface ToastProps {
  message: string;
  leaving: boolean;
}

export function Toast({ message, leaving }: ToastProps) {
  return createPortal(
    <ToastEl $leaving={leaving}>{message}</ToastEl>,
    document.body,
  );
}

export function useToast(duration = 2500) {
  const [state, setState] = useState<{ message: string; leaving: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState({ message, leaving: false });
    timerRef.current = setTimeout(() => {
      setState((s) => s ? { ...s, leaving: true } : null);
      timerRef.current = setTimeout(() => setState(null), 300);
    }, duration);
  }, [duration]);

  const toast = state ? <Toast message={state.message} leaving={state.leaving} /> : null;

  return { show, toast };
}
