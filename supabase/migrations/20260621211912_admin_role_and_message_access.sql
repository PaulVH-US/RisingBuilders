-- Admin role + admin read access to private team-space discussions
--
-- Adds a platform-admin concept via a dedicated `admins` table. We intentionally
-- do NOT add an `is_admin` column to `profiles`: the existing `profiles_update_own`
-- policy lets a user update their own profile row with no column restriction, so
-- such a column would be a privilege-escalation hole (users could self-promote).
-- The `admins` table has no write policies, so rows can only be granted via the
-- Supabase dashboard or the service role.
--
-- Also adds an additive RLS policy letting admins read every team space's
-- messages (the private discussions), on top of the existing member-only access.

-- ---------------------------------------------------------------------------
-- admins
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A user may check their own admin status; nobody can enumerate other admins.
create policy "admins_select_own"
  on public.admins for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- No insert/update/delete policies: RLS denies all writes for anon/authenticated.
-- Admins are granted only via the Supabase dashboard or the service role.

-- ---------------------------------------------------------------------------
-- is_admin() helper
-- ---------------------------------------------------------------------------
-- SECURITY INVOKER (default): runs as the caller and relies on admins_select_own,
-- so it can only ever observe the caller's own admin row — no privilege leak and
-- no need to bypass RLS. search_path is pinned to '' per Supabase hardening
-- guidance, so all object references below are schema-qualified.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- messages: admin read access
-- ---------------------------------------------------------------------------
-- Additive (permissive) SELECT policy. Permissive policies are OR-ed together,
-- so this combines with messages_select_members: team members keep reading their
-- own team space, and admins can read every project's discussions.
create policy "messages_select_admin"
  on public.messages for select
  to authenticated
  using ((select public.is_admin()));
