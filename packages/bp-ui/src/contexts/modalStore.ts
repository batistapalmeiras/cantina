import { ReactNode } from 'react';

let content: ReactNode | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Store fora do React — pode ser chamada de qualquer componente, sem precisar de um Provider ancestral. */
export function openModal(node: ReactNode) {
  content = node;
  emit();
}

export function closeModal() {
  content = null;
  emit();
}

export function subscribeModal(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getModalSnapshot() {
  return content;
}

export function useModal() {
  return { open: openModal, close: closeModal };
}
