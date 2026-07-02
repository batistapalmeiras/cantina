// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Libs
import { fetchSessionsPage, useSessionCtx } from 'bp-core';
// Components
import { AppRoute } from '../../../routes/paths';
import { SessionSummary } from '../types';

const PAGE_SIZE = 5;

export function useSetup() {
  const { session, pendingSession, closeSession } = useSessionCtx();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadSessions(1);
  }, [session, pendingSession]);

  const loadSessions = async (page: number) => {
    const result = await fetchSessionsPage(page, PAGE_SIZE);
    setSessions(result.data);
    setTotalPages(result.totalPages);
    setCurrentPage(page);
  };

  const handleClose = () => closeSession();

  const viewSession = (id: string) => navigate(`${AppRoute.Report}/${id}`);

  return {
    session,
    pendingSession,
    sessions,
    currentPage,
    totalPages,
    loadSessions,
    handleClose,
    viewSession,
  };
}
