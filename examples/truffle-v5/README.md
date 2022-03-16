# TypeChain x Truffle v5 example

Note: examples in this dir require building monorepo first

```sh
# in the root of monorepo
pnpm install
pnpm build
```

## Running

```sh
pnpm install # it will automatically run TypeChain types generation

# pnpm generate-types to manually regenerate them

# run tests
truffle test

# migrations are kinda tricky (look at known limitation section) - we need to transpile ts to js file (this is not a case for tests)
pnpm migrate
```

## Known limitations

Migrations need to be transpiled to js before execution.
