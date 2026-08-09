// React
import { useSyncExternalStore } from 'react';
// Libs
import { Modal } from 'bp-kit';
// Local
import { closeModal, getModalSnapshot, subscribeModal } from './modalStore';

/** Renderize uma única vez, na raiz do app (`App.tsx`). */
export function ModalContainer() {
  const content = useSyncExternalStore(subscribeModal, getModalSnapshot);
  return content !== null ? <Modal close={closeModal}>{content}</Modal> : null;
}
