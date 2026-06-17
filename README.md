# Rising Builders

A project-first collaboration network for ambitious high school founders. Post a
small project idea, discover collaborators by skill and interest, form a
lightweight team, and start building — action over discussion.

## Features (MVP)

- **Auth & onboarding** — email/password sign up, then a minimal profile
  (username, skills, interests, goal, optional LinkedIn).
- **Project feed** — browse active projects, filter by interest tag or skill
  needed (no algorithmic ranking).
- **Create projects** — title, one-line description, category tags, skills
  needed, commitment level.
- **Join system** — request to join; the creator accepts or rejects.
- **Team space** — per-project member list, description, and a lightweight chat
  thread. Owners manage join requests and members.
- **Builders directory** — find collaborators by skills/interests.
- **Activity signal** — "active this week" + projects-joined count.

## Data model

`profiles` · `projects` · `memberships` · `join_requests` · `messages` — see
`supabase/migrations/`. Every table has row-level security with granular,
per-operation, per-role policies.

## Running locally

The app uses a local Supabase stack, which requires a **container runtime**
(Docker Desktop, Colima, or Podman) to be installed and running.

```bash
npm install

# 1. Start Supabase locally (applies migrations + loads demo seed data)
npx supabase start
npx supabase db reset   # replays migrations and seeds the feed

# 2. Start the Next.js dev server
npm run dev
```

`.env.local` is preconfigured for the local Supabase stack. If `supabase start`
prints different keys, copy the `API URL` and `anon key` into `.env.local`.

### Demo accounts (from the seed)

All seeded accounts use the password **`password123`**:

| Email | Username |
|-------|----------|
| `ada@risingbuilders.test`  | ada |
| `leo@risingbuilders.test`  | leo |
| `maya@risingbuilders.test` | maya |
| `sam@risingbuilders.test`  | sam |
| `nina@risingbuilders.test` | nina |

Sign in as **ada** to see owned projects with a pending join request to manage.

## Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Linter/Formatter**: Biome
- **Integrations**: Supabase

## Getting Started

```bash
# Install dependencies
npm install

# Fill in your env vars
$EDITOR .env.local

# Start the dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Your Supabase publishable (client) key |

Fill in your values in `.env.local`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run format` | Format code with Biome |
| `npm run lint` | Lint code with Biome |
| `npm run typecheck` | Run TypeScript type checking |

## Optional: Doppler for Secrets Management

For team environments, consider using [Doppler](https://www.doppler.com/) to manage env vars:

```bash
# Install Doppler CLI, then:
doppler setup
doppler run -- npm run dev
```
