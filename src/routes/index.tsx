import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { SessionProvider } from '../contexts/SessionContext';
import { ProtectedRoute } from './ProtectedRoute';
import { Layout } from '../components/Layout';
import { AppRoute } from './paths';
import { LoginPage } from '../pages/Login';
import { CashierPage } from '../pages/Cashier';
import { SetupPage } from '../pages/Setup';
import { SessionPage } from '../pages/Session';
import { ReportPage } from '../pages/Report';
import { OrdersPage } from '../pages/Orders';
import { KitchenPage } from '../pages/Kitchen';
import { ProfilePage } from '../pages/Profile';
import { ReservationPage } from '../pages/Reservation';
import { ReservationSuccessPage } from '../pages/Reservation/ReservationSuccess';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SessionProvider>
          <Routes>
            {/* Rotas públicas */}
            <Route path={AppRoute.Login} element={<LoginPage />} />
            <Route path={AppRoute.Reservation} element={<ReservationPage />} />
            <Route path={AppRoute.ReservationSuccess} element={<ReservationSuccessPage />} />

            {/* Rotas protegidas com Layout */}
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
