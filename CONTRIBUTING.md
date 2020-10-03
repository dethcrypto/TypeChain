# Contributing

We welcome all contributions!

## Developing

First, run `yarn` to install all deps.

We use TypeScript monorepo, each target is a separate package and has another package with tests. You need to run
`yarn watch` to automatically recompile all the projects as you introduce changes.

Run `yarn test:fix` before pushing, it will run eslint, prettier in fix mode and run all tests.

### Debugging 🐞

```sh
DEBUG=typechain typechain
```
