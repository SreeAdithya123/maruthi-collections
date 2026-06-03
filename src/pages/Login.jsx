import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIELD =
  'w-full border bg-ivory px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-zari-gold';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(form);
    setBusy(false);
    if (!error) navigate(loc.state?.from || '/account', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="label-roman">Welcome back</span>
          <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep">Sign in</h1>
          <p className="mt-2 text-sm text-ink-soft">to your Maruthi Collections account.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Email</label>
            <input type="email" required value={form.email} onChange={set('email')} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Password</label>
            <input type="password" required value={form.password} onChange={set('password')} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New here?{' '}
          <Link to="/signup" className="text-maroon hover:text-zari-gold">Create an account</Link>
        </p>
        <p className="mt-2 text-center font-sans text-xs text-ink-soft/70">
          Curator? Sign in with your admin email to manage the collection.
        </p>
      </div>
    </div>
  );
}
