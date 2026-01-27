# Testing Rules

## Structure

- Colocate tests: `foo.ts` → `foo.test.ts`
- Use `describe` for grouping, `it` for cases
- Name tests: "should [expected behavior] when [condition]"

## Patterns

- Arrange-Act-Assert structure
- One assertion per test when possible
- Use factories over fixtures for test data
- Mock at boundaries, not internals

## Coverage

- Test behavior, not implementation
- Focus on edge cases and error paths
- Skip trivial getters/setters
