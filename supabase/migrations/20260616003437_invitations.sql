-- Invitations: a project creator can invite a builder to join their project
-- with an optional note; the builder accepts or declines.
--
-- This is the mirror image of join_requests (which are builder -> project).
-- invitations are creator -> builder.

create table if not exists public.invitations (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  message     text check (message is null or char_length(message) <= 280),
  status      text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at  timestamptz not null default now(),
  unique (project_id, user_id)
);

create index if not exists invitations_project_id_idx on public.invitations (project_id);
create index if not exists invitations_user_id_idx on public.invitations (user_id);

alter table public.invitations enable row level security;

-- Visible to the invited builder and to the project creator.
create policy "invitations_select_invitee_or_creator"
  on public.invitations for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
  );

-- Only the project creator can invite, and not themselves.
create policy "invitations_insert_creator"
  on public.invitations for insert
  to authenticated
  with check (
    (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
    and (select auth.uid()) <> user_id
  );

-- The invited builder responds (accept / decline).
create policy "invitations_update_invitee"
  on public.invitations for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- The creator can cancel an invite; the invitee can dismiss it.
create policy "invitations_delete_invitee_or_creator"
  on public.invitations for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
  );

-- Allow an invited builder to add their own membership when accepting an
-- invitation (previously only the project creator could insert memberships).
drop policy if exists "memberships_insert_creator" on public.memberships;

create policy "memberships_insert_creator_or_invited"
  on public.memberships for insert
  to authenticated
  with check (
    (select auth.uid()) = (select p.creator_id from public.projects p where p.id = project_id)
    or (
      (select auth.uid()) = user_id
      and exists (
        select 1 from public.invitations i
        where i.project_id = memberships.project_id
          and i.user_id = (select auth.uid())
      )
    )
  );
