import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase, hasSupabase } from '../lib/supabase';

// Supabase Auth. `isAdmin` comes from profiles.is_admin, which you set MANUALLY
// in the Supabase dashboard (or via SQL) for admin accounts. Users self-signup
// and shop; the admin panel unlocks only for flagged accounts.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  const loadProfile = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      setUser(null);
      setIsAdmin(false);
      return;
    }
    let name = sessionUser.user_metadata?.full_name || sessionUser.email;
    let admin = false;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, is_admin')
        .eq('id', sessionUser.id)
        .single();
      if (data) {
        name = data.full_name || name;
        admin = !!data.is_admin;
      }
    } catch {
      /* profile may not exist yet — treat as non-admin */
    }
    setUser({ id: sessionUser.id, email: sessionUser.email, name });
    setIsAdmin(admin);
  }, []);

  useEffect(() => {
    if (!hasSupabase) {
      setReady(true);
      return undefined;
    }
    let subscription;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await loadProfile(session?.user || null);
      setReady(true);
      subscription = supabase.auth.onAuthStateChange((_event, s) => {
        loadProfile(s?.user || null);
      }).data.subscription;
    })();
    return () => subscription?.unsubscribe();
  }, [loadProfile]);

  const signUp = useCallback(
    async ({ name, email, password }) => {
      if (!hasSupabase) {
        toast.error('Accounts are not configured yet');
        return { error: 'no-supabase' };
      }
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) {
        toast.error(error.message);
        return { error: error.message };
      }
      if (!data.session) {
        toast('Check your email to confirm your account, then sign in.');
        return { needsConfirmation: true };
      }
      await loadProfile(data.user);
      toast.success(`Welcome, ${name.trim().split(' ')[0]}`);
      return {};
    },
    [loadProfile]
  );

  const signIn = useCallback(
    async ({ email, password }) => {
      if (!hasSupabase) {
        toast.error('Accounts are not configured yet');
        return { error: 'no-supabase' };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        toast.error(error.message);
        return { error: error.message };
      }
      await loadProfile(data.user);
      toast.success(`Namaskaram, ${(data.user.user_metadata?.full_name || data.user.email).split(' ')[0]}`);
      return {};
    },
    [loadProfile]
  );

  const signOut = useCallback(async () => {
    if (hasSupabase) await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    toast('Signed out');
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin, ready, signUp, signIn, signOut }),
    [user, isAdmin, ready, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
