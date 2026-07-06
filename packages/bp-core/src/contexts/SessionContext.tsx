// React
import { createContext, ReactNode } from 'react';
// Components
import { useSession } from '../hooks/useSession';
import { Dish,Order, Session } from '../types';

export interface SessionContextValue {
  session: Session | null;
  pendingSession: Session | null;
  loading: boolean;
  error: string | null;
  openSession: (session: Omit<Session, 'id' | 'orders'>) => Promise<void>;
  closeSession: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'delivered' | 'stayForMeal'> & { stayForMeal?: boolean }) => Promise<void>;
  confirmReservation: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateSession: (data: { ministry?: string; dishes?: Dish[] }) => Promise<void>;
  updateOrder: (orderId: string, data: Partial<Pick<Order, 'customerName' | 'customerPhone' | 'paymentMethod' | 'tickets' | 'total' | 'stayForMeal'>>) => Promise<void>;
  toggleDelivered: (orderId: string, delivered: boolean) => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const sessionValue = useSession();

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
}
