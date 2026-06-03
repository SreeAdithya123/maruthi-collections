import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing (e.g. a clone without .env, or Netlify without the
// vars set), the app still runs: auth is disabled and the catalogue falls back
// to the built-in sarees. With them set, everything is backed by Supabase.
export const supabase = url && key ? createClient(url, key) : null;
export const hasSupabase = Boolean(supabase);
