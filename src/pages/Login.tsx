import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Building2, KeyRound, LogIn, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../auth/authContext';

/**
 * Tizimga kirish sahifasi.
 * Hozircha: admin / admin123 (backend ishlamaguncha lokal tekshiruv).
 * Backend ishga tushgach /api/auth/login orqali tekshiriladi.
 */
const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const result = await login(username, password);
    setBusy(false);
    if (result.ok) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Kirish amalga oshmadi');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brend */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-[0_6px_18px_rgba(31,90,224,0.35)]">
            <Building2 size={24} />
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-ink">Biznes Baza</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Boshqaruv paneliga kirish uchun hisobingizni kiriting
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="login">
                Login
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
                />
                <input
                  id="login"
                  className="input !pl-9"
                  placeholder="admin"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-soft" htmlFor="parol">
                Parol
              </label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted"
                />
                <input
                  id="parol"
                  type="password"
                  className="input !pl-9"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700"
              >
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-primary mt-1 disabled:opacity-60">
              <LogIn size={16} />
              {busy ? 'Tekshirilmoqda...' : 'Kirish'}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-600" />
            <p className="text-xs text-ink-soft">
              Vaqtinchalik hisob:{' '}
              <strong className="text-ink">admin</strong> / <strong className="text-ink">admin123</strong>
              . Backend'ga ulangach, login server orqali tekshiriladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
