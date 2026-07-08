// React
import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
// Libs
import { useAuthCtx, fetchSessionById, useSessionCtx, Session, UserRole } from 'bp-core';
// Components
import { useOrdersList } from '../../../hooks/useOrdersList';
import { computeStats, downloadReportXlsx } from '../domain';

export function useReport() {
  const { session: activeSession, pendingSession, confirmReservation, cancelOrder } = useSessionCtx();
  const { user } = useAuthCtx();
  const { id } = useParams<{ id: string }>();

  const isAdmin = user?.role === UserRole.Admin;
  const sessionId = isAdmin ? (id ?? null) : null;

  const [historicalSession, setHistoricalSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setHistoricalSession(null); return; }
    setLoading(true);
    fetchSessionById(sessionId).then((s) => { setHistoricalSession(s); setLoading(false); });
  }, [sessionId]);

  const currentSession = activeSession ?? pendingSession;
  const session = sessionId ? historicalSession : currentSession;

  const list = useOrdersList(session?.orders ?? []);

  const canResolveReservations = !sessionId && !!session && isAdmin;

  const downloadReport = () => {
    if (!session) return;
    void downloadReportXlsx(session);
  };

  if (!session) {
    return { session: null, stats: null, loading, canResolveReservations: false, isAdmin, confirmReservation, cancelOrder, downloadReport, ...list };
  }

  const { stats } = computeStats(session);
  return { session, stats, loading, canResolveReservations, isAdmin, confirmReservation, cancelOrder, downloadReport, ...list };
}
