import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FIELD =
  'w-full border bg-ivory px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-zari-gold';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await requestPasswordReset(email);
    setBusy(false);
    if (!error) setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 py-32">
      <div className="w-full max-w-md">
        {sent ? (
          <div className="text-center">
            <MailCheck size={30} className="mx-auto text-zari-gold" />
            <h1 className="mt-4 font-display text-4xl font-light text-maroon-deep">Check your email</h1>
            <p className="mt-3 text-ink-soft">
              If an account exists for <span className="text-maroon-deep">{email}</span>, we&rsquo;ve sent a link to
              reset your password. It opens right here on the site.
            </p>
            <Link to="/login" className="btn-ghost mt-8 inline-flex">Back to sign in</Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="label-roman">Forgot your password?</span>
              <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep">Reset it</h1>
              <p className="mt-2 text-sm text-ink-soft">We&rsquo;ll email you a secure link to set a new one.</p>
            </div>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="you@email.com" />
              </div>
              <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
                {busy ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              Remembered it?{' '}
              <Link to="/login" className="text-maroon hover:text-zari-gold">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
