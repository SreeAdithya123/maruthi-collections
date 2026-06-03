-- Maruthi Collections — accounts, admin role, and product catalogue.
-- Applied to the Supabase project via MCP; kept here for reproducibility.

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- A user may read only their own profile (to learn their is_admin flag).
-- Profiles are created by the trigger below; the is_admin flag is set MANUALLY
-- by the owner in the dashboard — users cannot escalate themselves.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used by product write policies (see 0002 for SECURITY INVOKER).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ============ products ============
-- The full product object is stored as jsonb (small catalogue, client-side
-- filtering). `id` mirrors the product's id.
create table public.products (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.products enable row level security;

create policy "products_select_all" on public.products
  for select using (true);
create policy "products_admin_insert" on public.products
  for insert with check (public.is_admin());
create policy "products_admin_update" on public.products
  for update using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_delete" on public.products
  for delete using (public.is_admin());

create index products_data_gin on public.products using gin (data);
