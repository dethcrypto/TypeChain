<p align="center">
  <img src="https://github.com/Neufund/TypeChain/blob/d82f3cc644a11e22ca8e42505c16f035e2f2555d/docs/images/typechain-logo.png?raw=true" width="300" alt="TypeChain">
  <h3 align="center">TypeChain Hardhat plugin</h3>
  <p align="center">Zero-config TypeChain support for Hardhat</p>

  <p align="center">
    <a href="https://github.com/ethereum-ts/TypeChain/actions"><img alt="Build Status" src="https://github.com/ethereum-ts/TypeChain/workflows/CI/badge.svg"></a>
    <img alt="Downloads" src="https://img.shields.io/npm/dm/typechain.svg">
    <a href="https://github.com/prettier/prettier"><img alt="Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
  </p>
</p>

# Description

Automatically generate TypeScript bindings for smartcontracts while using [Hardhat](https://hardhat.org/).

# Installation

If you use Ethers/Waffle do:

```bash
npm install --save-dev typechain ts-generator @typechain/hardhat @typechain/ethers-v5
```

If you're a Truffle user you need:

```bash
npm install --save-dev typechain ts-generator @typechain/hardhat @typechain/truffle-v5
```

And add the following statement to your hardhat.config.js:

```javascript
require('@typechain/hardhat')
```

Or, if you are using TypeScript, add this to your hardhat.config.ts:

```typescript
import '@typechain/hardhat'
```

## Zero Config Usage

Run the _compile_ task as normal, and Typechain artifacts will automatically be generated in a root directory called
`typechain`. Further configuration options are detailed below.

## Tasks

This plugin overrides the _compile_ task and automatically generates new Typechain artifacts on each compilation.

There is an optional flag `--no-typechain` which can be passed in to skip Typechain compilation.

This plugin adds the _typechain_ task to hardhat:

```
Generate Typechain typings for compiled contracts
```

## Configuration

This plugin extends the `hardhatConfig` optional `typechain` object. The object contains two fields, `outDir` and
`target`. `outDir` is the output directory of the artifacts that TypeChain creates (defaults to `typechain`). `target`
is one of the targets specified by the TypeChain [docs](https://github.com/ethereum-ts/TypeChain#cli) (defaults to
`ethers`).

This is an example of how to set it:

```js
module.exports = {
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
  },
}
```

## Usage

`npx hardhat compile` - Compiles and generates Typescript typings for your contracts. Example Waffle + Ethers test that
uses typedefs for contracts:

```ts
import { ethers, waffle } from '@nomiclabs/hardhat'
import chai from 'chai'
import { Wallet } from 'ethers'

import CounterArtifact from '../artifacts/Counter.json'
import { Counter } from '../typechain/Counter'

const { deployContract } = waffle
const { expect } = chai

describe('Counter', () => {
  let counter: Counter

  beforeEach(async () => {
    // 1
    const signers = await ethers.signers()

    // 2
    counter = (await deployContract(<Wallet>signers[0], CounterArtifact)) as Counter
    const initialCount = await counter.getCount()

    // 3
    expect(initialCount).to.eq(0)
    expect(counter.address).to.properAddress
  })

  // 4
  describe('count up', async () => {
    it('should count up', async () => {
      await counter.countUp()
      let count = await counter.getCount()
      expect(count).to.eq(1)
    })
  })

  describe('count down', async () => {
    // 5
    it('should fail', async () => {
      await counter.countDown()
    })

    it('should count down', async () => {
      await counter.countUp()

      await counter.countDown()
      const count = await counter.getCount()
      expect(count).to.eq(0)
    })
  })
})
```

## Examples

- [starter kit](https://github.com/rhlsthrm/typescript-solidity-dev-starter-kit)
- [example-ethers](https://github.com/ethereum-ts/TypeChain/tree/master/examples/hardhat)
- [example-truffle](https://github.com/ethereum-ts/TypeChain/tree/master/examples/hardhat-truffle-v5)

Original work done by [@RHLSTHRM](https://twitter.com/RHLSTHRM).
