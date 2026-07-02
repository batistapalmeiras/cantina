// React
import { createPortal } from 'react-dom';
// Local
import { ToastEl } from './styles';

export { useToast } from './hooks';

interface ToastProps {
  message: string;
  leaving: boolean;
}

export function Toast({ message, leaving }: ToastProps) {
  return createPortal(<ToastEl $leaving={leaving}>{message}</ToastEl>, document.body);
}
