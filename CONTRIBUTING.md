# Contributing

We welcome all contributions!

## Developing

First, run `yarn` to install all deps.

We use TypeScript monorepo, each target is a separate package and has another package with tests. You need to run
`yarn watch` to automatically recompile all the projects as you introduce changes.

Run `yarn test:fix` before pushing, it will run eslint, prettier in fix mode and run all tests.

### Local linking

Run `yarn build` to build all packages or `yarn watch` to start watching. Then enter desired package directory and run `yarn link`.

### Debugging 🐞

```sh
DEBUG=typechain typechain
```
