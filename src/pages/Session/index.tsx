// React
import { Navigate } from 'react-router-dom';
// Components
import { Button } from '../../components/Button';
import { PageHeader } from '../../components/PageHeader';
import { SessionFormFields } from '../../components/SessionForm';
import { AppRoute } from '../../routes/paths';
// Local
import { useSessionForm } from './hooks/useSessionForm';
import { ActionsRow } from './styles';
import { SessionMode } from './types';

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
