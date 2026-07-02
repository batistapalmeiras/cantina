import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CashierPage } from './pages/Cashier';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CashierPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
