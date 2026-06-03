# Supabase setup — Maruthi Collections

Project: **Maruthi-Collections** (`ahpnbaveemfrvftwkmvo`, ap-south-1).

## Environment variables
The client reads these (safe to expose — protected by Row Level Security):

```
VITE_SUPABASE_URL=https://ahpnbaveemfrvftwkmvo.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_…
```

- **Local:** in `.env` (gitignored). See `.env.example`.
- **Netlify:** add both in Site → Settings → Environment variables, then redeploy.
  Without them the site still runs (auth disabled, catalogue falls back to the
  built-in sarees).

## Schema
Applied via `supabase/migrations/`:
- `0001_accounts_admin_products.sql` — `profiles` (+ auto-create trigger),
  `is_admin()`, `products` (jsonb) with public-read / admin-write RLS.
- `0002_harden_security_definer_functions.sql` — security-advisor fixes.

## Making someone an admin (manual, by design)
1. The person signs up normally in the app.
2. In Supabase → SQL editor:
   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'their@email.com');
   ```
3. They sign in → the **Curator Studio** (`/admin`) unlocks. Admins add/edit/
   delete sarees; changes are written to `products` and show on the live site.

## Catalogue
The `/admin` page has **Seed catalogue (35 sarees)** to populate `products`
from the built-in set (already seeded once). Until seeded, shoppers see the
built-in sarees as a fallback.

## Recommended Auth settings (dashboard)
- **Confirm email** — turn OFF if you want shoppers to register and buy
  immediately (no email step). Leave ON for stricter security (the app shows a
  "check your email" message and handles it).
- **Leaked password protection** — enable (Auth → Policies) to block known
  compromised passwords.
