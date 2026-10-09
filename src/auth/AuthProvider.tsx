import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import { AuthContext, type AuthContextValue, type LoginResult } from './authContext';

const SESSION_KEY = 'biznes-baza.auth.v1';

/**
 * VAQTINCHALIK hisob (backend ishlamaguncha).
 * Server mavjud bo'lsa — birinchi navbatda /api/auth/login tekshiriladi,
 * server javob bermasa shu qiymatlar ishlatiladi.
 * Backend'da login/parol ADMIN_LOGIN / ADMIN_PASSWORD orqali beriladi.
 */
const FALLBACK_LOGIN = 'admin';
const FALLBACK_PASSWORD = 'admin123';

interface Session {
  username: string;
  token?: string;
  at: number;
}

function readSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    return parsed && typeof parsed.username === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null): void {
  try {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // private mode — jim o'tamiz
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());

  const login = useCallback(async (username: string, password: string): Promise<LoginResult> => {
    const loginName = username.trim();

    // 1) Server mavjud bo'lsa — undan tekshiramiz
    try {
      const res = await api.login(loginName, password);
      if (res.ok && res.user) {
        const next: Session = { username: res.user.username, token: res.token, at: Date.now() };
        setSession(next);
        writeSession(next);
        return { ok: true };
      }
      if (res.error) return { ok: false, error: res.error };
    } catch {
      // Server yo'q — pastdagi lokal tekshiruvga o'tamiz
    }

    // 2) Lokal (vaqtinchalik) hisob
    if (loginName === FALLBACK_LOGIN && password === FALLBACK_PASSWORD) {
      const next: Session = { username: loginName, at: Date.now() };
      setSession(next);
      writeSession(next);
      return { ok: true };
    }

    return { ok: false, error: 'Login yoki parol xato' };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    writeSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session ? { username: session.username } : null,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
