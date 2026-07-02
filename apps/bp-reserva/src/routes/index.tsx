// React
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// Libs
import { SessionProvider } from 'bp-core';
// Components
import { ReservationPage } from '../pages/Reservation';
import { ReservationSuccessPage } from '../pages/ReservationSuccess';
// Local
import { AppRoute } from './paths';

export function AppRouter() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path={AppRoute.Reservation} element={<ReservationPage />} />
          <Route path={AppRoute.ReservationSuccess} element={<ReservationSuccessPage />} />
          <Route path="*" element={<Navigate to={AppRoute.Reservation} replace />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
