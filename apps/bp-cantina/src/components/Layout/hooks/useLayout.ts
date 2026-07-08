// React
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Components
import { useAuthCtx, useSessionCtx, UserRole } from 'bp-core';
import { AppRoute } from '../../../routes/paths';

export function useLayout() {
  const { user, logout } = useAuthCtx();
  const { session } = useSessionCtx();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === UserRole.Admin;
  const isKitchen = user?.role === UserRole.Kitchen;
  const hasOpenSession = session?.isOpen === true;

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

  const tabRoutes = [AppRoute.Setup, AppRoute.Cashier, AppRoute.Orders, AppRoute.Kitchen];
  const hiddenRoutes = [AppRoute.NewSession, AppRoute.EditSession, AppRoute.Report, AppRoute.Profile];
  const isTabRoute = tabRoutes.some(route => location.pathname === route) && !hiddenRoutes.some(route => location.pathname.startsWith(route));

  return {
    user,
    navigate,
    open,
    setOpen,
    ref,
    isAdmin,
    hasOpenSession,
    handleLogout,
    isActive,
    showSetup: isTabRoute && isAdmin,
    showCashier: isTabRoute && hasOpenSession && !isKitchen,
    showOrders: isTabRoute && hasOpenSession && !isKitchen,
    showKitchen: isTabRoute && hasOpenSession,
  };
}
