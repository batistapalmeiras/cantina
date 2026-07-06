// Libs
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  // The app reads REACT_APP_* via bp-core's process.env access (kept identical to
  // the CRA app and to bp-reserva). Vite doesn't expose non-VITE_ vars, so we load
  // them (from apps/bp-cantina/.env -> ../../.env, or the CI/Vercel environment)
  // and inject them through `define`.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: { port: 3000 },
    // Output to build/ (not Vite's default dist/) to match the existing deploy config.
    build: { outDir: 'build' },
    define: {
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(env.REACT_APP_SUPABASE_URL ?? ''),
      'process.env.REACT_APP_SUPABASE_ANON_KEY': JSON.stringify(env.REACT_APP_SUPABASE_ANON_KEY ?? ''),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
    },
  };
});
