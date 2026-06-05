-- Orders + email automation support.
-- Orders are created when a signed-in customer places an order; the row drives
-- the invoice email (see supabase/functions/email). Marketing opt-in lets users
-- turn new-arrival emails off.

alter table public.profiles add column if not exists email_opt_in boolean not null default true;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text unique,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  customer_name text,
  phone text,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  discount integer not null default 0,
  gst integer not null default 0,
  total integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Human-friendly invoice number: MC-YYYYMMDD-0001 (IST date).
create sequence if not exists public.order_seq;
grant usage on sequence public.order_seq to authenticated;

create or replace function public.set_order_no()
returns trigger language plpgsql as $$
begin
  if new.order_no is null then
    new.order_no := 'MC-' || to_char(now() at time zone 'Asia/Kolkata', 'YYYYMMDD')
                    || '-' || lpad(nextval('public.order_seq')::text, 4, '0');
  end if;
  return new;
end $$;

drop trigger if exists trg_set_order_no on public.orders;
create trigger trg_set_order_no before insert on public.orders
  for each row execute function public.set_order_no();

alter table public.orders enable row level security;

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert on public.orders to authenticated;
