import styled from 'styled-components';
import { AlertTriangle } from 'lucide-react';
import { ModalTitle } from '../../../components/Modal';
import { Button } from '../../../components/Button';

interface Props {
  pendingCount: number;
  close: () => void;
  onConfirm: () => void;
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Alert = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: ${({ theme }) => theme.rounded.sm};

  svg { flex-shrink: 0; color: #b45309; margin-top: 2px; }
`;

const AlertText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: #92400e;
  line-height: 1.5;
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.bodySm.fontSize};
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.5;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export function CloseSessionDialog({ pendingCount, close, onConfirm }: Props) {
  return (
    <div>
      <ModalTitle>Encerrar sessão</ModalTitle>
      <Body>
        {pendingCount > 0 ? (
          <Alert>
            <AlertTriangle size={18} />
            <AlertText>
              Há <strong>{pendingCount} reserva{pendingCount !== 1 ? 's' : ''} pendente{pendingCount !== 1 ? 's' : ''}</strong>. A sessão ficará em modo pendente até todas serem confirmadas ou canceladas.
            </AlertText>
          </Alert>
        ) : (
          <Description>
            Tem certeza que deseja encerrar a sessão? Esta ação não pode ser desfeita.
          </Description>
        )}
        <Actions>
          <Button variant="secondary" size="md" onClick={close}>Cancelar</Button>
          <Button variant="danger" size="md" onClick={() => { onConfirm(); close(); }}>
            Encerrar sessão
          </Button>
        </Actions>
      </Body>
    </div>
  );
}
