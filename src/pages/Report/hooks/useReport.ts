import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSessionCtx, fetchSessionById } from '../../../hooks/useSession';
import { useAuthCtx } from '../../../hooks/useAuth';
import { useOrdersList } from '../../../hooks/useOrdersList';
import { Session } from '../../../types';
import { computeStats } from '../domain';

export function useReport() {
  const { session: activeSession, pendingSession } = useSessionCtx();
  const { user } = useAuthCtx();
  const { id } = useParams<{ id: string }>();

  const isAdmin = user?.role === 'admin';
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

  const isEditable = !!session && isAdmin;
  const canEditSession = !sessionId && !!session && session.isOpen === true && isAdmin;

  if (!session) {
    return { session: null, stats: null, dishMap: null, loading, isEditable: false, canEditSession: false, isAdmin, ...list };
  }

  const { stats, dishMap } = computeStats(session);
  return { session, stats, dishMap, loading, isEditable, canEditSession, isAdmin, ...list };
}
