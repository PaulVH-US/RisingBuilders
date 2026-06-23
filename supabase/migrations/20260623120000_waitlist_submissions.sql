-- Waitlist submissions collected before the app opens to the public.
-- Anyone can submit; only authenticated users (admins) can read entries.

create table if not exists waitlist_submissions (
  id         uuid        primary key default gen_random_uuid(),
  first_name text        not null,
  last_name  text        not null,
  email      text        not null,
  intent     text        not null check (intent in ('start_project', 'join_project', 'explore')),
  details    text,
  created_at timestamptz not null default now()
);

-- Prevent duplicate email sign-ups (case-insensitive)
create unique index if not exists waitlist_submissions_email_idx
  on waitlist_submissions (lower(email));

alter table waitlist_submissions enable row level security;

-- Unauthenticated visitors can submit their info
create policy "waitlist_insert_anon"
  on waitlist_submissions
  for insert
  to anon
  with check (true);

-- Authenticated users (admins) can read all submissions
create policy "waitlist_select_authenticated"
  on waitlist_submissions
  for select
  to authenticated
  using (true);
