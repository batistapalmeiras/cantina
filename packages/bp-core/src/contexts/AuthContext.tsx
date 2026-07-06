// React
import { createContext, ReactNode } from 'react';
// Components
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  userEmail: string;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authValue = useAuth();
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}
