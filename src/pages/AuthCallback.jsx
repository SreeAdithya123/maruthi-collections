import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

/**
 * Lands here from the email confirmation / password-recovery link. We parse the
 * link ourselves (the client has detectSessionInUrl OFF) so we can read `type`
 * and route correctly: recovery → set a new password; signup/magiclink → log in
 * and go shopping. Handles all three link shapes Supabase may send:
 *   ?code=…                  (PKCE)
 *   ?token_hash=…&type=…     (OTP verify)
 *   #access_token=…&type=…   (implicit)
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const [msg, setMsg] = useState('Confirming your email…');

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      if (!supabase) {
        navigate('/login', { replace: true });
        return;
      }
      const u = new URL(window.location.href);
      const q = u.searchParams;
      const h = new URLSearchParams(u.hash.replace(/^#/, ''));
      const get = (k) => q.get(k) || h.get(k);

      const type = get('type'); // signup | recovery | magiclink | email_change | invite
      const errorDesc = get('error_description') || get('error');
      if (errorDesc) {
        toast.error(decodeURIComponent(errorDesc).replace(/\+/g, ' '));
        navigate('/login', { replace: true });
        return;
      }

      try {
        if (get('code')) {
          const { error } = await supabase.auth.exchangeCodeForSession(get('code'));
          if (error) throw error;
        } else if (get('token_hash')) {
          const { error } = await supabase.auth.verifyOtp({ token_hash: get('token_hash'), type: type || 'email' });
          if (error) throw error;
        } else if (h.get('access_token')) {
          const { error } = await supabase.auth.setSession({
            access_token: h.get('access_token'),
            refresh_token: h.get('refresh_token'),
          });
          if (error) throw error;
        }
      } catch (e) {
        toast.error('This link is invalid or has expired. Please request a new one.');
        navigate(type === 'recovery' ? '/forgot-password' : '/login', { replace: true });
        return;
      }

      // Tidy the URL (drop the token from the address bar).
      window.history.replaceState({}, '', '/auth/callback');

      if (type === 'recovery') {
        setMsg('Verified — set a new password…');
        navigate('/reset-password', { replace: true });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fire the welcome email once, after the email is verified (best-effort).
        if (type !== 'recovery') {
          supabase.functions.invoke('email', { body: { kind: 'welcome' } }).catch(() => {});
        }
        toast.success('Email verified — welcome to Maruthi Collections');
        navigate('/sarees', { replace: true });
      } else {
        toast('Your email is confirmed. Please sign in.');
        navigate('/login', { replace: true });
      }
    })();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-zari-gold border-t-transparent" aria-hidden="true" />
      <p className="mt-5 font-display text-xl font-light text-maroon-deep">{msg}</p>
      <p className="mt-1 font-sans text-xs text-ink-soft">One moment.</p>
    </div>
  );
}
