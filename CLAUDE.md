# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules (Always Follow)

- Do what's asked; nothing more, nothing less
- Be terse in explanations
- Read CLAUDE-LOCAL.md for local rules and working notes
- On context restore: re-read this file and all imports
- After context clear: re-read this file and all imports

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

# Development
bun run --watch apps/api/src/index.ts      # API with hot reload
bun run --watch apps/minion/src/index.ts   # Minion worker with hot reload
bun ./apps/www/server.js                   # WWW frontend (NODE_ENV=development)
bun ./apps/admin/server.js                 # Admin frontend (NODE_ENV=development)

# Or use workspace scripts from app directories
cd apps/www && bun run dev
cd apps/api && bun run dev

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
bun run deploy-api
bun run deploy-www
bun run deploy-admin
bun run deploy-301
```

## Architecture

This is a Bun monorepo for joshgretz.com with workspaces in `apps/*` and `packages/*`.

### Apps

- **api** - Elysia REST API with bearer auth. Composes routes from domain packages (users, running, ping). Uses `injectx` for dependency injection.
- **www** - Public website. Remix + Vite + Express, styled with Tailwind. Uses `remix-flat-routes` for file-based routing.
- **admin** - Admin dashboard. Same stack as www.
- **minion** - Background worker consuming RabbitMQ messages via `ServiceBus` from the `workflow` package.
- **301** - Redirect service for alternate domains (joshgretz.io, .bio, .dev, .us).

### Packages (shared libraries)

- **database** - Drizzle ORM with PostgreSQL. Schema in `schema/`. Creates database connections via `createDatabase()`.
- **env** - Environment variable parsing with Zod via `parseEnv()`.
- **workflow** - RabbitMQ message bus (`ServiceBus`) for inter-service communication.
- **users**, **running**, **ping**, **strava**, **geoapify** - Domain packages exporting `Api` (Elysia routes), `Bus` (message handlers), and container setup functions.

### Key Patterns

- **Dependency Injection**: Packages use `injectx` for DI. Call `setupXContainer()` at app startup to bind dependencies.
- **API Composition**: API routes are Elysia plugins. The main API imports and `.use()`s them.
- **Message Bus**: Minion worker composes message handlers with `new ServiceBus().use(Bus1).use(Bus2).start()`.
- **Path Aliases**: tsconfig defines aliases like `database`, `strava`, `users` pointing to package entry points.
