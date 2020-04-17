# TypeChain x Truffle v4 example

## Running

```sh
yarn # it will automatically run TypeChain types generation

# yarn generate-types to manually regenerate them

# run tests
truffle test

# migrations are kinda tricky (look at known limitation section) - we need to transpile ts to js file (this is not a case for tests)
yarn migrate
```


## Known limitations

Migrations need to be transpiled to js before execution.
