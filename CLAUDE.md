# joshgretz.com

Bun monorepo for joshgretz.com with workspaces in `apps/*` and `packages/*`.

**After reading:** Check CLAUDE-WORKING.md for ongoing work context.

## Commands

```bash
bun install                 # Install deps (from root)
bun run dev                 # www (3000) + api (3001)
bun run dev:api             # API only (port 3001)
bun run dev:www             # WWW only (port 3000)
bun run dev:301             # Redirect service

# Linting (frontend apps use Biome)
cd apps/www && bun run lint
cd apps/www && bun run fix  # auto-fix

# Type checking
cd apps/www && bun run typecheck

# Database (from packages/database)
cd packages/database
bun run generate --name <descriptive-name>  # drizzle-kit generate (always use --name)
bun run migrate                             # drizzle-kit migrate

# Deploy to Fly.io
bun run deploy:api
bun run deploy:www
bun run deploy:301
```

## Project Rules

- Be a good boy scout - if you encounter errors, even if pre-existing, fix them
- React: state-based layout principles, keep layouts clean
- Record working notes to CLAUDE-WORKING.md

## Apps

- **api** - Elysia REST API with bearer auth. Routes in `src/routes/`. Uses `injectx` for DI.
- **www** - TanStack Start + Vite, Tailwind. Admin routes at `/admin/*` require Google OAuth.
- **301** - Redirect service for alternate domains (joshgretz.io, .bio, .dev, .us).

## Packages

- **database** - Drizzle ORM + PostgreSQL. Schema in `schema/`. `createDatabase()`.
- **env** - Zod env parsing via `parseEnv()`.
- **users** - User domain: `findUserByEmail()`, third-party access CRUD.
- **running** - Running domain: `importActivitiesForDateRange()`, activity queries.
- **strava** - Strava API client: `getActivities()`, auth flow.
- **ping** - Health check endpoint.
- **geoapify** - Reverse geocoding API client.

## Key Patterns

- **DI**: Packages use `injectx`. Call `setupXContainer()` at startup.
- **API Routes**: Elysia plugins in `apps/api/src/routes/`. Bearer token auth.
- **Admin Auth**: Google OAuth, cookie session, `requireAuth` beforeLoad guard.
- **TanStack Router**: File-based routing in `apps/www/src/routes/`. Do NOT edit `routeTree.gen.ts`.
- **Path Aliases**: tsconfig aliases like `database`, `strava`, `users` -> package entry points.
