import { createContext, useContext } from 'react';

export interface AuthUser {
  username: string;
}

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth faqat <AuthProvider> ichida ishlatiladi');
  }
  return ctx;
}
