import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FIELD =
  'w-full border bg-ivory px-4 py-3 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-zari-gold';

export default function Signup() {
  const { signUp, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null); // email awaiting verification

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const res = await signUp(form);
    setBusy(false);
    if (res.needsConfirmation) {
      setPending(res.email || form.email);
      return;
    }
    if (!res.error) navigate('/account', { replace: true });
  };

  if (pending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-6 py-32">
        <div className="w-full max-w-md text-center">
          <MailCheck size={30} className="mx-auto text-zari-gold" />
          <h1 className="mt-4 font-display text-4xl font-light text-maroon-deep">Verify your email</h1>
          <p className="mt-3 text-ink-soft">
            We&rsquo;ve sent a confirmation link to <span className="text-maroon-deep">{pending}</span>. Click it and
            you&rsquo;ll come straight back here, signed in and ready to shop.
          </p>
          <button onClick={() => resendVerification(pending)} className="btn-ghost mt-8">
            Resend email
          </button>
          <p className="mt-4 text-sm text-ink-soft">
            Wrong address?{' '}
            <button onClick={() => setPending(null)} className="text-maroon hover:text-zari-gold">Start over</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center">
          <span className="label-roman">Join the boutique</span>
          <h1 className="mt-3 font-display text-4xl font-light text-maroon-deep">Create your account</h1>
          <p className="mt-2 text-sm text-ink-soft">Save sarees, track orders, and shop with Sai Priyanka.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Full Name</label>
            <input type="text" required value={form.name} onChange={set('name')} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="Your name" />
          </div>
          <div>
            <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Email</label>
            <input type="email" required value={form.email} onChange={set('email')} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="you@email.com" />
          </div>
          <div>
            <label className="mb-2 block font-roman text-[0.58rem] uppercase tracking-[0.2em] text-ink-soft">Password</label>
            <input type="password" required minLength={6} value={form.password} onChange={set('password')} className={FIELD} style={{ borderColor: 'var(--border)' }} placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60">
            {busy ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="text-maroon hover:text-zari-gold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
