// React
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Libs
import { useClient } from 'bp-core';
// Components
import { AppRoute } from '../../../routes/paths';

export function useLayout() {
  const { client, loading: clientLoading, logoutClient } = useClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logoutClient();
    navigate(AppRoute.Reservation);
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return { client, clientLoading, navigate, open, setOpen, ref, handleLogout, isActive };
}
