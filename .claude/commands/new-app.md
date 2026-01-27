Create a new app in the monorepo:

App name: $ARGUMENTS

Steps:
1. Determine app type from name or ask if unclear (api, web, cli, worker)
2. Create `apps/$ARGUMENTS/` with appropriate scaffolding
3. Configure `package.json` (name: `@apps/$ARGUMENTS`)
4. Set up `tsconfig.json` extending root
5. Follow existing app patterns in the repo

Output the created structure.
