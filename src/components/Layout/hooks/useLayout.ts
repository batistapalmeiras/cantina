// React
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Components
import { useAuthCtx } from '../../../hooks/useAuth';
import { useSessionCtx } from '../../../hooks/useSession';
import { AppRoute } from '../../../routes/paths';

export function useLayout() {
  const { user, logout } = useAuthCtx();
  const { session, pendingSession } = useSessionCtx();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const hasOpenSession = session?.isOpen === true;
  const hasActiveSession = hasOpenSession || !!pendingSession;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    window.location.href = AppRoute.Login;
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return {
    user,
    navigate,
    open,
    setOpen,
    ref,
    isAdmin,
    hasOpenSession,
    hasActiveSession,
    handleLogout,
    isActive,
    showSetup: isAdmin,
    showCashier: hasOpenSession,
    showOrders: hasActiveSession,
    showKitchen: hasActiveSession,
  };
}
