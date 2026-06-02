import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// LOCAL-DEV AUTH STUB — replaced by Supabase Auth in Phase B.
//
// This stores accounts in localStorage (plaintext — fine for local dev only).
// In Supabase, signUp/signIn/signOut map to supabase.auth.*, and `isAdmin`
// comes from a `profiles.is_admin` flag you set manually for admin accounts.
//
// Local admin to test the dashboard:  admin@maruthi.collections / maruthi
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);
const USERS_KEY = 'maruthi-users';
const SESSION_KEY = 'maruthi-session';
const ADMIN_EMAILS = ['admin@maruthi.collections'];

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};
const saveUsers = (u) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
  } catch {
    /* ignore */
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Seed the local admin once.
    const users = loadUsers();
    if (!users.find((u) => u.email === 'admin@maruthi.collections')) {
      users.push({ name: 'Sai Priyanka', email: 'admin@maruthi.collections', password: 'maruthi' });
      saveUsers(users);
    }
    try {
      const email = localStorage.getItem(SESSION_KEY);
      const u = email && loadUsers().find((x) => x.email === email);
      if (u) setUser({ name: u.name, email: u.email });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setSession = (email) => {
    try {
      localStorage.setItem(SESSION_KEY, email);
    } catch {
      /* ignore */
    }
  };

  const signUp = useCallback(async ({ name, email, password }) => {
    const e = email.trim().toLowerCase();
    const users = loadUsers();
    if (users.find((u) => u.email === e)) {
      toast.error('An account with this email already exists');
      return { error: 'exists' };
    }
    users.push({ name: name.trim(), email: e, password });
    saveUsers(users);
    setSession(e);
    setUser({ name: name.trim(), email: e });
    toast.success(`Welcome, ${name.trim().split(' ')[0]}`);
    return {};
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const e = email.trim().toLowerCase();
    const u = loadUsers().find((x) => x.email === e);
    if (!u || u.password !== password) {
      toast.error('Wrong email or password');
      return { error: 'invalid' };
    }
    setSession(e);
    setUser({ name: u.name, email: u.email });
    toast.success(`Namaskaram, ${u.name.split(' ')[0]}`);
    return {};
  }, []);

  const signOut = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
    toast('Signed out');
  }, []);

  const isAdmin = !!user && ADMIN_EMAILS.includes(user.email);

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
