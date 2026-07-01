import { Navigate } from 'react-router-dom';
import { useAuthCtx } from '../hooks';
import { UserRole } from '../types';
import { AppRoute } from './paths';

interface Props {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuthCtx();

  if (!user) return <Navigate to={AppRoute.Login} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={AppRoute.Cashier} replace />;

  return <>{children}</>;
}
