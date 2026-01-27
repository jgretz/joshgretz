# TypeScript Rules

## Types

- Prefer `type` over `interface` unless extending
- Use `as const` for literal types
- Avoid `any`; use `unknown` with type guards
- Export types from dedicated `types.ts` files

## Patterns

- Use discriminated unions for state
- Prefer `Result<T, E>` pattern over throwing
- Use `ts-pattern` for exhaustive matching:

```ts
import { match } from 'ts-pattern';

match(state)
  .with({ status: 'loading' }, () => <Spinner />)
  .with({ status: 'error' }, ({ error }) => <Error msg={error} />)
  .with({ status: 'success' }, ({ data }) => <Content data={data} />)
  .exhaustive();
```

## Imports

- Destructure: `import { foo, bar } from 'module'`
- Use path aliases: `@app/*`, `@packages/*`
- Group: external → internal → relative → types
