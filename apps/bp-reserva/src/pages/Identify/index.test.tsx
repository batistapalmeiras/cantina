// React
import { MemoryRouter } from 'react-router-dom';
// Libs
import { render, screen } from '@testing-library/react';
import { theme } from 'bp-ui';
import { ThemeProvider } from 'styled-components';
// Local
import { IdentifyPage } from './index';

// The guest client hook talks to Supabase; stub it so the page renders with no
// client (phone phase).
vi.mock('bp-core', () => ({
  useClient: () => ({
    client: null,
    findClientByPhone: vi.fn(),
    loginWithClient: vi.fn(),
    loginClient: vi.fn(),
  }),
}));

function renderIdentify() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <IdentifyPage />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

test('renders the phone identification step', () => {
  renderIdentify();

  expect(screen.getByText('Identificação')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('(31) 99999-0000')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
});
