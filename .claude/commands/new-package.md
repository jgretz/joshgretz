Create a new package in the monorepo:

Package name: $ARGUMENTS

Steps:
1. Create `packages/$ARGUMENTS/` with:
   - `package.json` (name: `@packages/$ARGUMENTS`)
   - `tsconfig.json` extending root
   - `src/index.ts` (barrel export)
   - `src/types.ts` (type definitions)
2. Use ES modules configuration
3. Follow existing package patterns in the repo

Output the created structure.
