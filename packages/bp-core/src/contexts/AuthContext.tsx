// React
import { createContext, ReactNode, useRef } from 'react';
// Components
import { useAuth } from '../hooks/useAuth';

export interface AuthContextValue {
  user: any;
  userEmail: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string) => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authValueRef = useRef<AuthContextValue | null>(null);
  if (!authValueRef.current) {
    authValueRef.current = useAuth();
  }
  return (
    <AuthContext.Provider value={authValueRef.current}>
      {children}
    </AuthContext.Provider>
  );
}
