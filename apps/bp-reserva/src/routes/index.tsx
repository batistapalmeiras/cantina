// React
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// Libs
import { SessionProvider } from 'bp-core';
// Components
import { ReservaLayout } from '../components/ReservaLayout';
import { HistoryPage } from '../pages/History';
import { IdentifyPage } from '../pages/Identify';
import { ProfilePage } from '../pages/Profile';
import { ReservationPage } from '../pages/Reservation';
import { ReservationConfirmedPage } from '../pages/ReservationConfirmed';
// Local
import { AppRoute } from './paths';

export function AppRouter() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path={AppRoute.Identify} element={<IdentifyPage />} />
          <Route path={AppRoute.ReservationConfirmed} element={<ReservationConfirmedPage />} />
          <Route
            path="/*"
            element={
              <ReservaLayout>
                <Routes>
                  <Route path={AppRoute.Reservation} element={<ReservationPage />} />
                  <Route path={AppRoute.History} element={<HistoryPage />} />
                  <Route path={AppRoute.Profile} element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to={AppRoute.Reservation} replace />} />
                </Routes>
              </ReservaLayout>
            }
          />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
