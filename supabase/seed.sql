-- Rising Builders local seed data
--
-- Avoids the "empty feed" problem (PRD 7.5) by creating a handful of demo
-- builders and active projects. Runs automatically on `supabase db reset`.
--
-- All demo accounts use the password: password123
-- Emails: ada@risingbuilders.test, leo@…, maya@…, sam@…, nina@…
--
-- NOTE: directly inserting auth users is only appropriate for LOCAL development.

-- --- Auth users -----------------------------------------------------------
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, email_change, email_change_token_new, recovery_token)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'ada@risingbuilders.test',  crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'leo@risingbuilders.test',  crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'maya@risingbuilders.test', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'sam@risingbuilders.test',  crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'nina@risingbuilders.test', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

-- Matching email identities (required by GoTrue for password sign-in).
insert into auth.identities
  (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '{"sub":"11111111-1111-1111-1111-111111111111","email":"ada@risingbuilders.test","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '{"sub":"22222222-2222-2222-2222-222222222222","email":"leo@risingbuilders.test","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), '33333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '{"sub":"33333333-3333-3333-3333-333333333333","email":"maya@risingbuilders.test","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), '44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', '{"sub":"44444444-4444-4444-4444-444444444444","email":"sam@risingbuilders.test","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), '55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', '{"sub":"55555555-5555-5555-5555-555555555555","email":"nina@risingbuilders.test","email_verified":true}', 'email', now(), now(), now());

-- --- Profiles -------------------------------------------------------------
insert into public.profiles (id, username, skills, interests, goal, linkedin_url, last_active_at)
values
  ('11111111-1111-1111-1111-111111111111', 'ada',  '{coding,design}',          '{AI,education}',         'start',   'https://linkedin.com/in/ada',  now()),
  ('22222222-2222-2222-2222-222222222222', 'leo',  '{coding,product}',         '{productivity,health}',  'start',   null,                            now() - interval '2 days'),
  ('33333333-3333-3333-3333-333333333333', 'maya', '{design,marketing}',       '{climate,community}',    'join',    'https://linkedin.com/in/maya', now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'sam',  '{coding,data}',            '{food,sustainability}',  'start',   null,                            now() - interval '10 days'),
  ('55555555-5555-5555-5555-555555555555', 'nina', '{writing,marketing}',      '{education,AI}',         'explore', 'https://linkedin.com/in/nina', now() - interval '3 hours');

-- --- Projects -------------------------------------------------------------
insert into public.projects (id, creator_id, title, description, category_tags, skills_needed, commitment_level, created_at)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'StudyFlow', 'A focus timer that turns study sessions into a shared streak with friends.', '{AI,education,productivity}', '{coding,design}', 'medium', now() - interval '1 day'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'HackHabit',  'Weekend hackathon idea: an app that nudges teens to build one tiny habit a day.', '{health,productivity}', '{coding,marketing}', 'low', now() - interval '4 hours'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'GreenMap',   'Crowdsourced map of recycling and refill stations around our city.', '{climate,community}', '{design,data,coding}', 'high', now() - interval '3 days'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'PitchPal',   'Practice your startup pitch with instant AI feedback on clarity and energy.', '{AI,education}', '{coding,writing}', 'medium', now() - interval '6 hours'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'CampusBite', 'Connect students with surplus cafeteria food before it gets tossed.', '{food,sustainability,community}', '{coding,data,marketing}', 'medium', now() - interval '5 days');

-- --- Memberships (each creator owns their project; a few extra members) ----
insert into public.memberships (project_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'member'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'owner'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'owner'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'member'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'owner'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'owner');

-- --- Join requests (pending requests for creators to act on) --------------
insert into public.join_requests (project_id, user_id, status, message) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'pending', 'I can build the timer logic in React. Would love to help!'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '55555555-5555-5555-5555-555555555555', 'pending', 'I can write the launch copy and run socials.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'pending', 'Happy to own the data pipeline.');

-- --- Team-space messages --------------------------------------------------
insert into public.messages (project_id, user_id, content, created_at) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Welcome Maya! Want to take the first pass at the UI?', now() - interval '20 hours'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'On it. I''ll share a Figma by tomorrow.', now() - interval '18 hours'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 'Sam, can you scrape the city open-data portal for station locations?', now() - interval '2 days'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'Yep, found a JSON endpoint. Pushing a draft tonight.', now() - interval '2 days' + interval '3 hours');
