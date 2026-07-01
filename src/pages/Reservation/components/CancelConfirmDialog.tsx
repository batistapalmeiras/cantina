// Libs
import styled from 'styled-components';
// Components
import { Button } from '../../../components/Button';
import { ModalActions,ModalTitle } from '../../../components/Modal';
import { Typography } from '../../../components/Typography';

interface Props {
  close: () => void;
  onConfirm: () => void;
}

const Message = styled.div`
  margin-bottom: 4px;
`;

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
