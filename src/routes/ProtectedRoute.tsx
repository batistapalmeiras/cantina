// React
import { Navigate } from 'react-router-dom';
// Components
import { useAuthCtx } from '../hooks';
import { UserRole } from '../types';
// Local
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
