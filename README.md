<p align="center">
  <img src="https://github.com/Neufund/TypeChain/blob/d82f3cc644a11e22ca8e42505c16f035e2f2555d/docs/images/typechain-logo.png?raw=true" width="300" alt="TypeChain">
  <h3 align="center">TypeChain</h3>
  <p align="center">🔌 Typescript bindings for Ethereum smartcontracts</p>

  <p align="center">
    <a href="https://circleci.com/gh/ethereum-ts/TypeChain"><img alt="Build Status" src="https://circleci.com/gh/ethereum-ts/TypeChain/tree/master.svg?style=svg"></a>
    <a href="https://coveralls.io/github/ethereum-ts/TypeChain?branch=master"><img alt="Coverage" src="https://coveralls.io/repos/github/ethereum-ts/TypeChain/badge.svg?branch=master"></a>
    <img alt="Downloads" src="https://img.shields.io/npm/dm/typechain.svg">
    <a href="https://github.com/prettier/prettier"><img alt="Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
  </p>

  <p align="center">
    <a href="https://blog.neufund.org/introducing-typechain-typescript-bindings-for-ethereum-smart-contracts-839fc2becf22">Medium post</a> | <a href="https://www.youtube.com/watch?v=9x6AkShGkwU">DappCon Video</a>
  </p>

  <p align="center">
    Contributed with: <br/>
    <img src="https://github.com/Neufund/TypeChain/blob/6d358df7b2da6b62d56f9935f1666b17b93176f0/docs/images/neufund-logo.png?raw=true" width="100" alt="Neufund">
  </p>
</p>

## Features ⚡

* static typing - you will never call not existing method again
* IDE support - works with any IDE supporting Typescript
* works with multiple libraries - use `truffle`,`Web3.js 1.0`, `ethers.js`, `Web3.js 0.20.x`
* frictionless - works with simple, JSON ABI files as well as with Truffle style ABIs

## Installation

```bash
npm install --save-dev typechain
```

```bash
yarn add --dev typechain
```

## Usage

### CLI

```
typechain --target=(truffle|web3-1.0.0|legacy) [glob]
```

* `glob` - pattern that will be used to find ABIs, remember about adding quotes: `typechain
  "**/*.json"`
* `--target` - `truffle`, `web3-1.0.0`, `ethers` or `legacy`
* `--outDir` - put all generated files to a specific dir

Typechain always will rewrite existing files. You should not commit them. Read more in FAQ section.

Example:

```
typechain --target --outDir app/contracts './node_modules/neufund-contracts/build/contracts/*.json'
```

### ts-generator unified config

Typechain is a plugin to [ts-generator](https://github.com/krzkaczor/ts-generator) meaning that you can as well create unified config. 

`ts-generator.json` file:

```
[
  {
    "generator": "typechain",
    "files": "./build/**/*.json",
    "target": "truffle"
  }
]
```

then just run `ts-generator` (you need to have `ts-generator` installed in your project).

This can be a great way to run more code generation plugins (css modules types, graphql types etc. ) at the same time.

## Demo 🏎️

![Demo](https://media.giphy.com/media/3oFzmqgHxrPZFhBst2/giphy.gif)

[Example usage](https://github.com/Neufund/commit.neufund.org/pull/331/files)

## Getting started 📚

### Motivation

Interacting with blockchain in Javascript is a pain. Web3 interface is sluggish and when using it 
with Typescript it gets even worse. Often, you can't be sure what given method call will
actually do without looking at ABI file. TypeChain is here to solve these problems (as long as you
use Typescript).

### How does it work?

TypeChain is code generator - provide ABI file and you will get Typescript class with flexible
interface for interacting with blockchain. Depending on the target parameter it can generate typings for 
truffle, web3 1.0.0 or web3 0.20.x (legacy target).

### Step by step guide

Install typechain with `yarn add --dev typechain`.

Run `typechain --target=your_target` (you might need to make sure that it's available in your path if you installed it
only locally), it will automatically find all `.abi` files in your project and generate Typescript
classes based on them. You can specify your glob pattern: `typechain --target=your_target "**/*.abi.json"`.
`node_modules` are always ignored. We recommend git ignoring these generated files and making typechain part of your build process.

That's it! Now, just import contract bindings as any other file `import { MyAwesomeContract } from
'./contracts/MyAwesomeContract'` and start interacting with it. We use named exports because of
[this](https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad).

## Targets 🎯

### Truffle

Truffle target is great when you use truffle contracts already. Check out [truffle-typechain-example](https://github.com/ethereum-ts/truffle-typechain-example) for more details. It require installing [typings](https://www.npmjs.com/package/truffle-typings) for truffle library itself. 

Now you can simply use your contracts as you did before and get full type safety, yay!

### Web3-1.0.0

Generates typings for contracts compatible with latest Web3.js version. Typings for library itself are now part of `Web3 1.0.0` library so nothing additional is needed. For now it needs explicit cast as shown [here](https://github.com/krzkaczor/TypeChain/pull/88/files#diff-540a9b8840419be93ddb8d4b53325637R8), this will be fixed after improving official typings.

### Ethers.js

Use `ethers` target to generate wrappers for [ethers.js](https://github.com/ethers-io/ethers.js/) lib.

### Legacy (Web3 0.2.x)

This was default and only target for typechain 0.2.x. It requires `Web3.js 0.20.x` to be installed in your project and it generates promise based wrappers. It's nice upgrade comparing to raw callbacks but in the near future Typechain will support `Web3js 1.0` target.


## FAQ 🤔

### Q: Should I commit generated files to my repository?

A: _NO_ — we believe that no generated files should go to git repository. You should git ignore them
and make `typechain` run automatically for example in post install hook in package.json:

```
"postinstall":"typechain"
```

When you update ABI, just regenerate files with TypeChain and Typescript compiler will find any
breaking changes for you.

### Q: How do I customize generated classes? (legacy target only)

A: You can create your own class that extends generated one and adds additional methods etc.

Currently we discuss various ideas around extendibility including APIs files (adding semantics to
ABIs for covering popular cases like working with dates) or using user-defined templates for
generated code.

### Q: Generated files won't match current codestyle of my project  :(

A: We will automatically format generated classes with `prettier` to match your coding preferences (just make sure to use `.prettierrc` file). 

Furthermore, we will silent tslint for generated files with `/* tslint:disable */` comments.

### Usage as API

You may want to use `ts-generator` api to kick off whole process by api: 

```typescript
import { tsGen } from "ts-generator";
import { Typechain } from "typechain";

async function main() {
  await tsGen({ cwd }, new Typechain({ cwd, rawConfig: { files: "your-glob-here", outDir: "optional out dir path" } }));
}
```

### Running tests

```
yarn        # install all dependencies
yarn test   # runs tests + linting
```

### Debugging 🐞

```sh
DEBUG=typechain typechain
```


# Licence

Krzysztof Kaczor (krzkaczor) MIT | [Github](https://github.com/krzkaczor) | [Twitter](https://twitter.com/krzkaczor)