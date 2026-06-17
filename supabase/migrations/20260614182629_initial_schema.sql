-- Rising Builders — initial schema
--
-- Core relational model for the MVP:
--   profiles       — minimal user profile (skills, interests, goal, optional LinkedIn)
--   projects       — student project ideas posted to the feed
--   memberships    — confirmed team members per project
--   join_requests  — requests to join a project (pending / accepted / rejected)
--   messages       — lightweight per-project team-space chat
--
-- Every table lives in the exposed `public` schema, so RLS is enabled on all of
-- them and policies are written per-operation and per-role (no FOR ALL).

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text not null unique,
  skills        text[] not null default '{}',
  interests     text[] not null default '{}',
  goal          text not null check (goal in ('start', 'join', 'explore')),
  linkedin_url  text,
  last_active_at timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Any authenticated builder can browse other builders to find collaborators.
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  to authenticated
  using ((select auth.uid()) = id);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  creator_id      uuid not null references public.profiles (id) on delete cascade,
  title           text not null check (char_length(title) between 1 and 120),
  description     text not null check (char_length(description) between 1 and 280),
  category_tags   text[] not null default '{}',
  skills_needed   text[] not null default '{}',
  commitment_level text not null check (commitment_level in ('low', 'medium', 'high')),
  created_at      timestamptz not null default now()
);

create index if not exists projects_creator_id_idx on public.projects (creator_id);
create index if not exists projects_created_at_idx on public.projects (created_at desc);

alter table public.projects enable row level security;

-- The feed is open to all authenticated builders.
create policy "projects_select_authenticated"
  on public.projects for select
  to authenticated
  using (true);

create policy "projects_insert_own"
  on public.projects for insert
  to authenticated
  with check ((select auth.uid()) = creator_id);

create policy "projects_update_creator"
  on public.projects for update
  to authenticated
  using ((select auth.uid()) = creator_id)
  with check ((select auth.uid()) = creator_id);

create policy "projects_delete_creator"
  on public.projects for delete
  to authenticated
  using ((select auth.uid()) = creator_id);

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------
create table if not exists public.memberships (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'member')),
  created_at  timestamptz not null default now(),
  unique (project_id, user_id)
);

create index if not exists memberships_project_id_idx on public.memberships (project_id);
create index if not exists memberships_user_id_idx on public.memberships (user_id);

alter table public.memberships enable row level security;

-- Team rosters are visible to all authenticated builders (used on project cards
-- and the team space). Kept intentionally open to avoid RLS recursion between
-- projects and memberships.
create policy "memberships_select_authenticated"
  on public.memberships for select
  to authenticated
  using (true);

-- A membership is created by the project creator: either seeding their own
-- owner row at creation time, or adding a builder when accepting a join request.
create policy "memberships_insert_creator"
  on public.memberships for insert
  to authenticated
  with check (
    (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
  );

-- The project creator can remove members; a member can remove themselves (leave).
create policy "memberships_delete_creator_or_self"
  on public.memberships for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
  );

-- ---------------------------------------------------------------------------
-- join_requests
-- ---------------------------------------------------------------------------
create table if not exists public.join_requests (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  status      text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  message     text check (message is null or char_length(message) <= 280),
  created_at  timestamptz not null default now(),
  unique (project_id, user_id)
);

create index if not exists join_requests_project_id_idx on public.join_requests (project_id);
create index if not exists join_requests_user_id_idx on public.join_requests (user_id);

alter table public.join_requests enable row level security;

-- A request is visible to the requester and to the project creator.
create policy "join_requests_select_requester_or_creator"
  on public.join_requests for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
  );

-- Builders request to join on their own behalf.
create policy "join_requests_insert_own"
  on public.join_requests for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- The project creator accepts/rejects (updates status).
create policy "join_requests_update_creator"
  on public.join_requests for update
  to authenticated
  using ((select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id))
  with check ((select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id));

-- The requester can withdraw their own request.
create policy "join_requests_delete_own"
  on public.join_requests for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- messages (per-project team space)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  content     text not null check (char_length(content) between 1 and 2000),
  created_at  timestamptz not null default now()
);

create index if not exists messages_project_id_idx on public.messages (project_id, created_at);

alter table public.messages enable row level security;

-- Only team members of a project can read its team-space messages.
create policy "messages_select_members"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.memberships m
      where m.project_id = messages.project_id
        and m.user_id = (select auth.uid())
    )
  );

-- Only team members can post, and only as themselves.
create policy "messages_insert_members"
  on public.messages for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.memberships m
      where m.project_id = messages.project_id
        and m.user_id = (select auth.uid())
    )
  );

-- Authors can delete their own messages.
create policy "messages_delete_own"
  on public.messages for delete
  to authenticated
  using ((select auth.uid()) = user_id);
