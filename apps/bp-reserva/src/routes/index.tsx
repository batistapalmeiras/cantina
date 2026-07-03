import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SessionProvider } from 'bp-core';
import { Layout } from '../components/Layout';
import { HistoryPage } from '../pages/History';
import { IdentifyPage } from '../pages/Identify';
import { ProfilePage } from '../pages/Profile';
import { ReservationPage } from '../pages/Reservation';
import { ReservationConfirmedPage } from '../pages/ReservationConfirmed';
import { EditReservationPage } from '../pages/EditReservation';
import { AppRoute } from './paths';

export function AppRouter() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path={AppRoute.Identify} element={<IdentifyPage />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path={AppRoute.Reservation} element={<ReservationPage />} />
                  <Route path={`${AppRoute.ReservationEdit}/:orderId`} element={<EditReservationPage />} />
                  <Route path={AppRoute.ReservationConfirmed} element={<ReservationConfirmedPage />} />
                  <Route path={AppRoute.History} element={<HistoryPage />} />
                  <Route path={AppRoute.Profile} element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to={AppRoute.Reservation} replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  );
}
