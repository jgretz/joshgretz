# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules (Always Follow)

- Do what's asked; nothing more, nothing less
- Be terse in explanations
- Read CLAUDE-LOCAL.md for local rules and working notes
- On context restore: re-read this file and all imports
- After context clear: re-read this file and all imports
- Be a good boy scout - if you encounter errors, even if they were pre-existing, fix them

## Code Style

- Prettier: single quotes, semicolons, trailing commas
- ES modules only (import/export), destructure imports
- Functional > OO > procedural
- Prefer `() =>` over `function()`
- Small composable functions
- Comments for "why" not "what", be terse

## Architecture

- Follow SOLID principles
- Prefer pattern matching (ts-pattern) over if/else chains
- React: state-based layout principles, keep layouts clean

## Imports

#.claude/rules/typescript.md
#.claude/rules/testing.md
#.claude/rules/git.md

## Build & Development Commands

```bash
# Install dependencies (from root)
bun install

# Development (main - runs www + api together)
bun run dev                 # www (3000) + api (3001)

# Individual apps
bun run dev:api             # API only (port 3001)
bun run dev:www             # WWW only (port 3000)
bun run dev:301             # Redirect service (not in main dev)

# Linting (frontend apps use Biome)
cd apps/www && bun run lint
cd apps/www && bun run fix  # auto-fix

# Type checking
cd apps/www && bun run typecheck

# Database (from packages/database)
cd packages/database
bun run generate  # drizzle-kit generate
bun run push      # drizzle-kit push

# Deploy to Fly.io
bun run deploy:api
bun run deploy:www
bun run deploy:301
```

## Architecture

This is a Bun monorepo for joshgretz.com with workspaces in `apps/*` and `packages/*`.

### Apps

- **api** - Elysia REST API with bearer auth. Routes defined in `src/routes/`. Uses `injectx` for dependency injection.
- **www** - Public website + admin section. TanStack Start + Vite, styled with Tailwind. Admin routes at `/admin/*` require Google OAuth login.
- **301** - Redirect service for alternate domains (joshgretz.io, .bio, .dev, .us).

### Packages (shared libraries)

- **database** - Drizzle ORM with PostgreSQL. Schema in `schema/`. Creates database connections via `createDatabase()`.
- **env** - Environment variable parsing with Zod via `parseEnv()`.
- **users** - User domain: `findUserByEmail()`, `thirdPartyAccessForUser()`, `setThirdPartyAccessForUser()`.
- **running** - Running domain: `importActivitiesForDateRange()`, activity queries.
- **strava** - Strava API client: `getActivities()`, `generateAuthUrl()`, `requestAuthToken()`.
- **ping** - Simple health check endpoint.
- **geoapify** - Geolocation API client for reverse geocoding.

### TanStack Router (www)

- File-based routing: routes in `apps/www/src/routes/` auto-generate `routeTree.gen.ts`
- After adding/removing route files, run `bun run dev:www` to regenerate the route tree
- Do NOT manually edit `routeTree.gen.ts`

### Key Patterns

- **Dependency Injection**: Packages use `injectx` for DI. Call `setupXContainer()` at app startup to bind dependencies.
- **API Routes**: Routes are Elysia plugins defined in `apps/api/src/routes/`. Guarded with bearer token auth.
- **Admin Auth**: www admin section uses Google OAuth. Session stored in cookie. Protected routes use `requireAuth` beforeLoad guard.
- **Path Aliases**: tsconfig defines aliases like `database`, `strava`, `users` pointing to package entry points.
