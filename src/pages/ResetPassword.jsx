import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const FIELD =
  'w-full border bg-ivory px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-zari-gold';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [hasSession, setHasSession] = useState(null); // null = checking

  // The recovery link establishes a session (via /auth/callback). Without one,
  // there's nothing to reset — send them to request a fresh link.
  useEffect(() => {
    if (!supabase) {
      setHasSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setHasSession(!!data.session));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Use at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords don’t match');
    setBusy(true);
    const { error } = await updatePassword(form.password);
    setBusy(false);
    if (!error) navigate('/account', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="label-roman">Almost there</span>
          <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep">Set a new password</h1>
        </div>

        {hasSession === false ? (
          <div className="mt-8 text-center">
            <p className="text-ink-soft">This reset link is invalid or has expired.</p>
            <button onClick={() => navigate('/forgot-password')} className="btn-primary mt-6">
              Request a new link
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">New password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="At least 6 characters" />
            </div>
            <div>
              <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Confirm password</label>
              <input type="password" required minLength={6} value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="Repeat it" />
            </div>
            <button type="submit" disabled={busy || hasSession === null} className="btn-primary w-full justify-center disabled:opacity-60">
              {busy ? 'Saving…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
