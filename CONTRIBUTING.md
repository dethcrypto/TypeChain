# Contributing

We welcome all contributions!

## Developing

Heads up: we use pnpm instead of yarn or npm. It might be new for you but I promise it's worth the hassle - it's really
good at making big monorepos deterministic. Please ensure that you are running pnpm version 7.

First, run `pnpm i` to install all deps.

We use TypeScript monorepo, each target is a separate package and has another package with tests. You need to run
`pnpm watch` to automatically recompile all the projects as you introduce changes.

Run `pnpm test:fix` before pushing, it will run eslint, prettier in fix mode and run all tests.

### Local linking

Run `pnpm build` to build all packages or `pnpm watch` to start watching. Then enter desired package directory and run
`pmpm link`.

### Debugging 🐞

```sh
DEBUG=typechain typechain
```
