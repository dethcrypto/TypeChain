# Contributing

We welcome all contributions!

## Developing

We use TypeScript monorepo, each target is a separate package and has another packagee with tests. You need to run
`yarn watch` to automatically recompile all the projects as you introduce changes.

Run `yarn test:fix` before pushing, it will run eslint, prettier in fix mode and run all tests.
