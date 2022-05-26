# Contributing

We welcome all contributions!

## Developing

Heads up: we use pnpm instead of yarn or npm. It might be new for you but I promise it's worth the hassle - it's
really good at making big monorepos deterministic. Please ensure that you are running pnpm version 7.

First, run `pnpm i` to install all deps.

We use TypeScript monorepo, each target is a separate package and has another package with tests. You need to run
`pnpm watch` to automatically recompile all the projects as you introduce changes.

Run `pnpm test:fix` before pushing, it will run eslint, prettier in fix mode and run all tests.  
NB: due to a [known issue](https://github.com/npm/cli/issues/3210) in the npm version newer than 6 it is not possible to
start the commands. A quick fix is to downgrade the npm version `npm install -g npm@6.14.17`.

### Visual Code Solidity Version

Since we develop using multiple versions of Solidity to avoid Linter errors from Visual Code in the following way we can
set the current solidity version.

1. Install the "Solidity" extension from the Marketplace
2. Inside `.sol` file, run right click -> `Solidity: change workspace compiler version (remote)`
3. Choose version from dropdown menu (0.6.4 or 0.8.9 or ...)

[Official Documentation](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)

### Local linking

Run `pnpm build` to build all packages or `pnpm watch` to start watching. Then enter desired package directory and run
`pmpm link`.

### Debugging 🐞

```sh
DEBUG=typechain typechain
```
