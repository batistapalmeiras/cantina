// Libs
import { UserRole } from 'bp-core';
import { ProfilePage as SharedProfilePage, useAuthCtx } from 'bp-kit';

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.Admin]: 'Administrador',
  [UserRole.Operator]: 'Operador',
  [UserRole.Kitchen]: 'Cozinha',
};

export function ProfilePage() {
  const { user } = useAuthCtx();
  return <SharedProfilePage roleLabel={user ? ROLE_LABELS[user.role as UserRole] : undefined} />;
}
