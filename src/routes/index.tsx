// React
import { BrowserRouter, Navigate,Route, Routes } from 'react-router-dom';
// Components
import { Layout } from '../components/Layout';
import { AuthProvider } from '../contexts/AuthContext';
import { SessionProvider } from '../contexts/SessionContext';
import { CashierPage } from '../pages/Cashier';
import { KitchenPage } from '../pages/Kitchen';
import { LoginPage } from '../pages/Login';
import { OrdersPage } from '../pages/Orders';
import { ProfilePage } from '../pages/Profile';
import { ReportPage } from '../pages/Report';
import { ReservationPage } from '../pages/Reservation';
import { ReservationSuccessPage } from '../pages/ReservationSuccess';
import { SessionPage } from '../pages/Session';
import { SetupPage } from '../pages/Setup';
// Local
import { AppRoute } from './paths';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SessionProvider>
          <Routes>
            <Route path={AppRoute.Login} element={<LoginPage />} />
            <Route path={AppRoute.Reservation} element={<ReservationPage />} />
            <Route path={AppRoute.ReservationSuccess} element={<ReservationSuccessPage />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path={AppRoute.Cashier}
                        element={
                          <ProtectedRoute roles={['admin', 'operator']}>
                            <CashierPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={AppRoute.Setup}
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <SetupPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={AppRoute.NewSession}
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <SessionPage mode="create" />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={AppRoute.EditSession}
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <SessionPage mode="edit" />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={AppRoute.Report}
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <ReportPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={`${AppRoute.Report}/:id`}
                        element={
                          <ProtectedRoute roles={['admin']}>
                            <ReportPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={AppRoute.Orders}
                        element={
                          <ProtectedRoute roles={['admin', 'operator']}>
                            <OrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={AppRoute.Kitchen}
                        element={
                          <ProtectedRoute roles={['admin', 'operator']}>
                            <KitchenPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route path={AppRoute.Profile} element={<ProfilePage />} />
                      <Route path="*" element={<Navigate to={AppRoute.Cashier} replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </SessionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
