type ToastState = { message: string; leaving: boolean } | null;

let state: ToastState = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Store fora do React — pode ser chamada de qualquer componente, sem precisar de um Provider ancestral. */
export function showToast(message: string, duration = 2500) {
  if (timer) clearTimeout(timer);
  state = { message, leaving: false };
  emit();
  timer = setTimeout(() => {
    state = state ? { ...state, leaving: true } : null;
    emit();
    timer = setTimeout(() => {
      state = null;
      emit();
    }, 300);
  }, duration);
}

export function subscribeToast(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastSnapshot() {
  return state;
}

export function useToast() {
  return { show: showToast };
}
