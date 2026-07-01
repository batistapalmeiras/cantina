import { Navigate } from 'react-router-dom';
import { useSessionForm } from './hooks/useSessionForm';
import { SessionMode } from './types';
import { AppRoute } from '../../routes/paths';
import { SessionFormFields } from '../../components/SessionForm';
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { ActionsRow } from './styles';

interface Props {
  mode: SessionMode;
}

export function SessionPage({ mode }: Props) {
  const { session, isEdit, control, isSubmitting, submit, cancel } = useSessionForm(mode);

  if (isEdit && !session) {
    return <Navigate to={AppRoute.Setup} replace />;
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Editar sessão' : 'Abrir sessão'}
        subtitle={isEdit && session
          ? `${session.ministry} · ${new Date(session.date).toLocaleDateString('pt-BR')}`
          : 'Configure o ministério e os pratos da sessão'}
        back
      />

      <SessionFormFields control={control} />

      <ActionsRow>
        <Button variant="secondary" size="lg" onClick={cancel}>Cancelar</Button>
        <Button variant="primary" size="lg" onClick={submit} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar' : 'Abrir sessão'}
        </Button>
      </ActionsRow>
    </div>
  );
}
