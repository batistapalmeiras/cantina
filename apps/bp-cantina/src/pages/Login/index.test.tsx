// React
import { MemoryRouter } from 'react-router-dom';
// Libs
import { render, screen } from '@testing-library/react';
import { AuthProvider, theme } from 'bp-kit';
import { ThemeProvider } from 'styled-components';
// Local
import { LoginPage } from './index';

vi.mock('bp-core', () => ({
  UserRole: { Admin: 'admin', Operator: 'operator', Kitchen: 'kitchen' },
}));

// AuthProvider only needs a client shaped enough to mount without crashing —
// LoginPage renders with no user logged in, deterministically.
const stubSupabaseClient = {
  auth: {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
} as unknown as Parameters<typeof AuthProvider>[0]['client'];

function renderLogin() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider client={stubSupabaseClient}>
          <LoginPage />
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

test('renders the login form with its fields and submit button', () => {
  renderLogin();

  expect(screen.getByText('Bem-vindo')).toBeInTheDocument();
  // NOTE: querying by placeholder, not label — BaseInput's <label> is not yet
  // associated to its input via htmlFor (tracked as an a11y fix in the plan).
  expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Mínimo 6 caracteres')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
});
