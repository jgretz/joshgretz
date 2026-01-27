# Git Rules

## Commits

- Conventional commits: `type(scope): message`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Scope = package or app name
- Message: imperative, lowercase, no period

## Examples

```
feat(auth): add oauth2 login flow
fix(api): handle null response from upstream
refactor(ui): extract button variants to shared
```

## Branches

- `main` - production
- `feat/description` - features
- `fix/description` - bug fixes
