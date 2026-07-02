// React
import { useNavigate } from 'react-router-dom';
// Libs
import { AlertTriangle } from 'lucide-react';
// Components
import { Button } from 'bp-ui';
import { PageHeader } from 'bp-ui';
import { Pagination } from 'bp-ui';
import { Typography } from 'bp-ui';
import { useModal } from 'bp-ui';
import { AppRoute } from '../../routes/paths';
// Local
import { CloseSessionDialog } from './components/CloseSessionDialog';
import { useSetup } from './hooks/useSetup';
import {
ActionsRow, HistoryBadge,
HistoryItem, HistoryItemMeta, HistoryItemSub, HistoryItemTitle,   HistoryList, PendingAlert, PendingAlertBody,
  Section,
  SessionBanner, SessionInfo, } from './styles';

export function SetupPage() {
  const { session, sessions, currentPage, totalPages, loadSessions, handleClose, viewSession } = useSetup();
  const { open, close, modal } = useModal();
  const navigate = useNavigate();

  const pendingSessionsCount = sessions.filter(s => s.status === 'pending').length;

  const historySection = (
    <Section>
      <Typography type="label" style={{ marginBottom: 16 }}>Histórico de sessões</Typography>
      <HistoryList>
        {sessions.length === 0 && <Typography type="p">Nenhuma sessão encontrada.</Typography>}
        {sessions.filter(s => !s.isOpen).map(s => (
          <HistoryItem key={s.id} onClick={() => viewSession(s.id)}>
            <HistoryItemMeta>
              <HistoryItemTitle>{s.ministry}</HistoryItemTitle>
              <HistoryItemSub>{new Date(s.date).toLocaleDateString('pt-BR')}</HistoryItemSub>
            </HistoryItemMeta>
            <HistoryBadge $status={s.status}>
              {s.status === 'pending' ? 'Pendente' : 'Encerrada'}
            </HistoryBadge>
          </HistoryItem>
        ))}
      </HistoryList>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={loadSessions} />
    </Section>
  );

  return (
    <div>
      <PageHeader
        title="Configurar"
        subtitle="Gerencie as sessões da cantina"
      />

      {session ? (
        <>
          <SessionBanner>
            <SessionInfo>
              <strong>Sessão aberta</strong>
              <p>{session.ministry} · {new Date(session.date).toLocaleDateString('pt-BR')}</p>
            </SessionInfo>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap'}}>
              <Button
                variant="secondary"
                style={{ flex: 1 }}
                onClick={() => navigate(AppRoute.EditSession)}
              >
                Editar sessão
              </Button>
              <Button
                variant="danger"
                style={{ flex: 1 }}
                onClick={() => open(
                  <CloseSessionDialog
                    pendingCount={session.orders.filter(o => o.status === 'reservation').length}
                    close={close}
                    onConfirm={handleClose}
                  />
                )}
              >
                Encerrar sessão
              </Button>
            </div>
          </SessionBanner>
        </>
      ) : (
        <>
          {pendingSessionsCount > 0 && (
            <PendingAlert style={{ marginBottom: 24 }}>
              <AlertTriangle size={20} />
              <PendingAlertBody>
                <strong>
                  {pendingSessionsCount} sessão{pendingSessionsCount !== 1 ? 'ões' : ''} com pendências
                </strong>
                <p>
                  Confirme ou cancele as reservas na tela de Relatório ou Pedidos.
                  Quando todas forem resolvidas, a sessão será encerrada automaticamente.
                </p>
              </PendingAlertBody>
            </PendingAlert>
          )}

          <ActionsRow style={{ marginBottom: 32 }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(AppRoute.NewSession)}
            >
              Abrir sessão
            </Button>
          </ActionsRow>
        </>
      )}

      {modal}
      {historySection}
    </div>
  );
}
