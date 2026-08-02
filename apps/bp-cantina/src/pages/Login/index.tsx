// Libs
import { UserRole } from 'bp-core';
import { LoginPage as SharedLoginPage } from 'bp-kit';
// Local
import icon from '../../assets/icon.png';
import { AppRoute } from '../../routes/paths';

function resolveRoute(role: string): string {
  if (role === UserRole.Admin) return AppRoute.Setup;
  if (role === UserRole.Kitchen) return AppRoute.Kitchen;
  return AppRoute.Cashier;
}

export function LoginPage() {
  return (
    <SharedLoginPage
      brand={{
        icon,
        iconAlt: 'Cantina Batista Palmeiras',
        name: 'Cantina Batista Palmeiras',
        sub: 'Igreja Batista de Palmeiras',
        quote: 'Mais que uma Igreja, uma Família!',
      }}
      resolveRoute={resolveRoute}
    />
  );
}
