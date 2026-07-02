// React
import { useCallback, useRef, useState } from 'react';
// Libs
import { Toast } from '..';

export function useToast(duration = 2500) {
  const [state, setState] = useState<{ message: string; leaving: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (message: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState({ message, leaving: false });
      timerRef.current = setTimeout(() => {
        setState((s) => (s ? { ...s, leaving: true } : null));
        timerRef.current = setTimeout(() => setState(null), 300);
      }, duration);
    },
    [duration],
  );

  const toast = state ? <Toast message={state.message} leaving={state.leaving} /> : null;

  return { show, toast };
}
