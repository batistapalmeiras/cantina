// Libs
import { Button, ModalActions, ModalTitle, Typography } from 'bp-ui';
// Local
import { Message } from './CancelConfirmDialog.styles';

interface Props {
  close: () => void;
  onConfirm: () => void;
}

export function CancelConfirmDialog({ close, onConfirm }: Props) {
  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <div>
      <ModalTitle>Cancelar reserva</ModalTitle>
      <Message>
        <Typography type="p">
          Tem certeza que deseja cancelar sua reserva? Você poderá fazer uma nova reserva depois.
        </Typography>
      </Message>
      <ModalActions>
        <Button variant="secondary" size="md" onClick={close}>
          Voltar
        </Button>
        <Button variant="danger" size="md" onClick={handleConfirm}>
          Cancelar reserva
        </Button>
      </ModalActions>
    </div>
  );
}
