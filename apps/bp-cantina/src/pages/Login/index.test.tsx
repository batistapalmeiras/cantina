// React
import { MemoryRouter } from 'react-router-dom';
// Libs
import { render, screen } from '@testing-library/react';
import { theme } from 'bp-ui';
import { ThemeProvider } from 'styled-components';
// Local
import { LoginPage } from './index';

// The auth context talks to Supabase; stub it so the page renders deterministically
// with no user logged in.
jest.mock('bp-core', () => ({
  useAuthCtx: () => ({ user: null, login: jest.fn() }),
  UserRole: { Admin: 'admin', Operator: 'operator', Kitchen: 'kitchen' },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <LoginPage />
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
