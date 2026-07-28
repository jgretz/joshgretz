# Scratch Database

Stand up a throwaway Postgres from the migration history to verify a `running` or
`database` change without touching production. Use `bun run db:migrate` — never
`drizzle-kit push`, which silently hides journal drift.

## 1. Bring up the container

Port 55432 avoids `joshgretz-pgboss` (5434) and `toryo-postgres` (5433):

```bash
docker run -d --name jg-scratch \
  -e POSTGRES_PASSWORD=scratch -e POSTGRES_DB=scratch \
  -p 55432:5432 postgres:16-alpine
docker exec jg-scratch pg_isready -U postgres -d scratch
```

## 2. Migrate

```bash
DATABASE_URL='postgres://postgres:scratch@localhost:55432/scratch' bun run db:migrate
```

Expect `[✓] migrations applied successfully!`. Anything else means the journal has
drifted from `packages/database/schema/` — the SQL file is wrong, not the snapshot.
`meta/*_snapshot.json` is the authority for what the DDL should have produced.

## 3. Seed a user

Drop a throwaway script at the repo root (the `database` path alias only resolves
inside the workspace):

```ts
// seed-scratch.ts
import {createDatabase, Schema} from './packages/database';

const db = createDatabase('postgres://postgres:scratch@localhost:55432/scratch');
console.log(await db.insert(Schema.users).values({email: 'test@example.com', admin: true}).returning());
process.exit(0);
```

```bash
bun run seed-scratch.ts && rm seed-scratch.ts
```

## 4. Tear down

```bash
docker rm -f jg-scratch
```
