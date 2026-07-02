import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from 'bp-core';
import { CashierPage } from './pages/Cashier';

export function AppRouter() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<CashierPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
