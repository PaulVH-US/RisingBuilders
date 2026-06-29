-- Replace linkedin_url with first_name, last_name, and up to 3 activity fields.
-- Activities replace the LinkedIn link as a way for builders to describe
-- what they're involved in (max 300 chars each).

-- Add name columns (default '' for existing rows)
alter table public.profiles
  add column if not exists first_name text not null default '',
  add column if not exists last_name  text not null default '';

-- Add activity columns (all optional, 300-char cap each)
alter table public.profiles
  add column if not exists activity_1 text check (activity_1 is null or char_length(activity_1) <= 300),
  add column if not exists activity_2 text check (activity_2 is null or char_length(activity_2) <= 300),
  add column if not exists activity_3 text check (activity_3 is null or char_length(activity_3) <= 300);

-- Drop the LinkedIn column
alter table public.profiles drop column if exists linkedin_url;

-- Index the name columns so ilike search scans efficiently
create index if not exists profiles_first_name_idx on public.profiles (lower(first_name));
create index if not exists profiles_last_name_idx  on public.profiles (lower(last_name));
