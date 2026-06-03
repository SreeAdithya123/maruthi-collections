-- Address Supabase security advisors on the SECURITY DEFINER functions.

-- is_admin() only reads the caller's own profile row (allowed by the
-- profiles_select_own policy), so it works correctly as SECURITY INVOKER and
-- no longer trips the "definer function callable by anon/authenticated" lint.
alter function public.is_admin() security invoker;

-- handle_new_user must stay SECURITY DEFINER for the signup trigger, but should
-- not be directly callable via the REST RPC endpoint.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
