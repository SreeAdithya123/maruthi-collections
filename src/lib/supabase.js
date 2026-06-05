import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing (e.g. a clone without .env, or Netlify without the
// vars set), the app still runs: auth is disabled and the catalogue falls back
// to the built-in sarees. With them set, everything is backed by Supabase.
//
// detectSessionInUrl is OFF so the /auth/callback page can parse the email
// confirmation / recovery link itself (it needs to read `type` before the URL
// is consumed, and decide where to send the user).
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          // Implicit: email confirmation / recovery links carry the session in the
          // URL hash, so they work even when opened on a different device than the
          // one that started sign-up (PKCE would require the same browser). The
          // /auth/callback page still also handles ?code and ?token_hash links.
          flowType: 'implicit',
        },
      })
    : null;

export const hasSupabase = Boolean(supabase);

// Where confirmation / recovery emails should send the user back to.
export const authRedirectTo = () =>
  typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
