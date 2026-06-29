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
insert into public.profiles (id, username, first_name, last_name, skills, interests, goal, activity_1, last_active_at)
values
  ('11111111-1111-1111-1111-111111111111', 'adalovelock',  'Ada',  'Lovelock',  '{coding,design}',     '{AI,education}',        'start',   'Founder of StudyFlow, an AI-powered focus timer for students',       now()),
  ('22222222-2222-2222-2222-222222222222', 'leomarcus',    'Leo',  'Marcus',    '{coding,product}',    '{productivity,health}', 'start',   'Building HackHabit to help teens form tiny daily habits',            now() - interval '2 days'),
  ('33333333-3333-3333-3333-333333333333', 'mayarivera',   'Maya', 'Rivera',    '{design,marketing}',  '{climate,community}',   'join',    'UX designer working on GreenMap, a crowdsourced recycling finder',  now() - interval '1 day'),
  ('44444444-4444-4444-4444-444444444444', 'samchen',      'Sam',  'Chen',      '{coding,data}',       '{food,sustainability}', 'start',   'Data engineer behind CampusBite, reducing cafeteria food waste',     now() - interval '10 days'),
  ('55555555-5555-5555-5555-555555555555', 'ninaoliver',   'Nina', 'Oliver',    '{writing,marketing}', '{education,AI}',        'explore', 'Freelance copywriter and content strategist for ed-tech startups',   now() - interval '3 hours');

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

-- --- Admins (local dev) ---------------------------------------------------
-- Make Ada a platform admin so the /admin page can be exercised locally. Ada is
-- only a member of StudyFlow, so visiting /admin proves admins can also read the
-- GreenMap team space they don't belong to. In production, grant admins via the
-- Supabase dashboard instead of seeding.
insert into public.admins (user_id) values
  ('11111111-1111-1111-1111-111111111111');

-- =============================================================================
-- DEMO PROFILES — test1@gmail.com … test5@gmail.com  (password: password123)
-- Five high-school builders, each with real-world accomplishments.
-- Cross-collaboration cap: 3 pairs.
-- =============================================================================

-- --- Auth users --------------------------------------------------------------
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, email_change, email_change_token_new, recovery_token)
values
  ('00000000-0000-0000-0000-000000000000', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'authenticated', 'authenticated', 'test1@gmail.com', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 'authenticated', 'authenticated', 'test2@gmail.com', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'authenticated', 'authenticated', 'test3@gmail.com', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 'authenticated', 'authenticated', 'test4@gmail.com', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5', 'authenticated', 'authenticated', 'test5@gmail.com', crypt('password123', gen_salt('bf')), now(), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '');

insert into auth.identities
  (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  (gen_random_uuid(), 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', '{"sub":"a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1","email":"test1@gmail.com","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', '{"sub":"a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2","email":"test2@gmail.com","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', '{"sub":"a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3","email":"test3@gmail.com","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', '{"sub":"a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4","email":"test4@gmail.com","email_verified":true}', 'email', now(), now(), now()),
  (gen_random_uuid(), 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5', '{"sub":"a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5","email":"test5@gmail.com","email_verified":true}', 'email', now(), now(), now());

-- --- Profiles ----------------------------------------------------------------
-- test1: Jordan Park — solo app developer + math tutor
-- test2: Claire Davis — 3-year class president
-- test3: Marcus Webb — neurology researcher + lifeguard
-- test4: Sofia Reyes — DECA ICDC top-20 finalist + Spanish tutor
-- test5: Ethan Zhao — ISEF qualifier
insert into public.profiles (id, username, first_name, last_name, skills, interests, goal, activity_1, activity_2, last_active_at)
values
  (
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    'jordanpark', 'Jordan', 'Park',
    '{coding,design,mobile}', '{mental-health,productivity,education}',
    'start',
    'Built MoodTrack, a mood-journaling app for teens — developed solo in React Native and Firebase, shipped to the App Store, and grew to 200+ downloads within the first month of launch.',
    'Peer math tutor at Lincoln High for two years, helping 10+ students weekly with AP Calculus and SAT prep.',
    now() - interval '6 hours'
  ),
  (
    'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2',
    'clairedavis', 'Claire', 'Davis',
    '{leadership,public-speaking,writing}', '{education,community,policy}',
    'join',
    'Elected Class President three consecutive years (10th–12th grade) at Westview High — led a 12-person student council, secured $15K in fundraising, and launched a mental health awareness week now held annually.',
    null,
    now() - interval '1 day'
  ),
  (
    'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3',
    'marcuswebb', 'Marcus', 'Webb',
    '{research,data,writing}', '{neuroscience,health,science}',
    'start',
    'Conducted independent research on sleep deprivation and adolescent neuroplasticity under Dr. Lisa Huang at UC San Diego — found a 23% drop in short-term memory after 48 hrs of sleep restriction in teens.',
    'Lifeguard at Oceanside Community Pool for two summers, CPR and water-rescue certified, supervising up to 150 swimmers per shift.',
    now() - interval '2 days'
  ),
  (
    'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4',
    'sofiareyes', 'Sofia', 'Reyes',
    '{marketing,writing,product}', '{entrepreneurship,food,business}',
    'start',
    'Top-20 Finalist at DECA ICDC 2024 in Entrepreneurship — presented a full business plan for a college-targeted meal-kit subscription service, competing against 3,000+ delegates from 60+ countries.',
    'Volunteer Spanish tutor at the public library on weekends, supporting 5–8 adult ESL learners per session in conversational fluency and literacy.',
    now() - interval '12 hours'
  ),
  (
    'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5',
    'ethanzhao', 'Ethan', 'Zhao',
    '{research,data,coding}', '{environmental-science,biology,AI}',
    'start',
    'Qualified for ISEF 2024 representing California — researched microplastic effects on zebrafish embryo neural development, won 1st Place at the regional fair and an ACS Special Award.',
    null,
    now() - interval '4 hours'
  );

-- --- Projects ----------------------------------------------------------------
insert into public.projects (id, creator_id, title, description, category_tags, skills_needed, commitment_level, created_at)
values
  -- Jordan (test1): 2 projects
  (
    'f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1',
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    'MoodTrack',
    'A mobile app that helps teens log daily moods and spot emotional patterns — simple emoji check-ins feed weekly insight summaries to build self-awareness over time.',
    '{mental-health,productivity,mobile}', '{coding,design,UX}',
    'medium', now() - interval '3 days'
  ),
  (
    'f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2',
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    'StudyBuddy AI',
    'An AI-powered study partner that adapts practice questions to a student''s weakest topics, using spaced repetition and Socratic prompting to accelerate long-term retention.',
    '{AI,education,productivity}', '{coding,AI,design}',
    'high', now() - interval '1 day'
  ),
  -- Claire (test2): 1 project
  (
    'f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3',
    'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2',
    'StudentConnect',
    'A platform for student governments to share event ideas, fundraising templates, and policy proposals — making it easier for any new council to hit the ground running.',
    '{education,community,leadership}', '{design,coding,writing}',
    'medium', now() - interval '5 days'
  ),
  -- Marcus (test3): 1 project
  (
    'f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4',
    'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3',
    'SleepIQ',
    'A research-grade sleep tracker for high schoolers that logs sleep quality and correlates it with next-day focus scores — extending the UCSD study into a wider student dataset.',
    '{health,neuroscience,data}', '{coding,data,research}',
    'low', now() - interval '7 days'
  ),
  -- Sofia (test4): 1 project
  (
    'f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5',
    'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4',
    'PitchDeck Starter',
    'A guided template library for high school entrepreneurs to build investor-ready pitch decks — inspired by competing at DECA ICDC and watching teams struggle with deck structure.',
    '{entrepreneurship,education,business}', '{design,writing,marketing}',
    'low', now() - interval '2 days'
  ),
  -- Ethan (test5): 2 projects
  (
    'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6',
    'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5',
    'EcoScan',
    'A barcode-scanning app that surfaces microplastic risk levels in everyday consumer products, drawing from a crowdsourced ingredient database and peer-reviewed research.',
    '{environment,health,science}', '{coding,data,research}',
    'high', now() - interval '4 days'
  ),
  (
    'f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f7f7f7',
    'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5',
    'OpenSciHub',
    'A hub for high school science fair participants to share research summaries, find mentors, and form cross-school collaborations — lowering the barrier to serious scientific work.',
    '{science,education,research}', '{coding,writing,design}',
    'medium', now() - interval '8 hours'
  );

-- --- Memberships -------------------------------------------------------------
-- Each creator owns their project(s). Cross-collaborations (max 3 pairs):
--   1. Jordan (test1) joins Ethan's EcoScan    — app/data skill overlap
--   2. Sofia  (test4) joins Claire's StudentConnect — DECA/leadership overlap
--   3. Marcus (test3) joins Ethan's OpenSciHub — shared science-research interest
insert into public.memberships (project_id, user_id, role) values
  ('f1f1f1f1-f1f1-f1f1-f1f1-f1f1f1f1f1f1', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'owner'),
  ('f2f2f2f2-f2f2-f2f2-f2f2-f2f2f2f2f2f2', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'owner'),
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'a2a2a2a2-a2a2-a2a2-a2a2-a2a2a2a2a2a2', 'owner'),
  ('f4f4f4f4-f4f4-f4f4-f4f4-f4f4f4f4f4f4', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'owner'),
  ('f5f5f5f5-f5f5-f5f5-f5f5-f5f5f5f5f5f5', 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 'owner'),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5', 'owner'),
  ('f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f7f7f7', 'a5a5a5a5-a5a5-a5a5-a5a5-a5a5a5a5a5a5', 'owner'),
  -- Cross-collaborations
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'member'),
  ('f3f3f3f3-f3f3-f3f3-f3f3-f3f3f3f3f3f3', 'a4a4a4a4-a4a4-a4a4-a4a4-a4a4a4a4a4a4', 'member'),
  ('f7f7f7f7-f7f7-f7f7-f7f7-f7f7f7f7f7f7', 'a3a3a3a3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'member');
