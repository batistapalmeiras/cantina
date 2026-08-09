// React
import { useSyncExternalStore } from 'react';
// Libs
import { Toast } from 'bp-kit';
// Local
import { getToastSnapshot, subscribeToast } from './toastStore';

/** Renderize uma única vez, na raiz do app (`App.tsx`). */
export function ToastContainer() {
  const state = useSyncExternalStore(subscribeToast, getToastSnapshot);
  return state ? <Toast message={state.message} leaving={state.leaving} /> : null;
}
