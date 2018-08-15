<p align="center">
  <img src="https://github.com/Neufund/TypeChain/blob/d82f3cc644a11e22ca8e42505c16f035e2f2555d/docs/images/typechain-logo.png?raw=true" width="300" alt="TypeChain">
  <h3 align="center">TypeChain</h3>
  <p align="center">🔌 Typescript bindings for Ethereum smartcontracts</p>

  <p align="center">
    <a href="https://circleci.com/gh/Neufund/TypeChain"><img alt="Build Status" src="https://circleci.com/gh/Neufund/TypeChain/tree/master.svg?style=svg"></a>
    <a href="https://github.com/prettier/prettier"><img alt="Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
  </p>

  <p align="center">
    <a href="https://blog.neufund.org/introducing-typechain-typescript-bindings-for-ethereum-smart-contracts-839fc2becf22">Medium post</a>
  </p>

  <p align="center">
    Contributed with: <br/>
    <img src="https://github.com/Neufund/TypeChain/blob/6d358df7b2da6b62d56f9935f1666b17b93176f0/docs/images/neufund-logo.png?raw=true" width="100" alt="Neufund">
  </p>
</p>

## Features ⚡

* static typing - you will never call not existing method again
* IDE support - works with any IDE supporting Typescript
* revamped API - native promises, safety checks and more!
* compatibility - under the hood it uses web3 so it's 100% compatible
* frictionless - works with simple, JSON ABI files as well as with Truffle style ABIs

## Installation

```bash
npm install --save-dev typechain
```

```bash
yarn add --dev typechain
```

Note: TypeChain requires web3 in version: `0.20.x`.

## Usage

```
typechain [--force] [glob]
```

* `glob` - pattern that will be used to find ABIs, remember about adding quotes: `typechain
  "**/*.json"`
* `--force` - force overwrite existing files
* `--outDir` - put all generated files to a specific dir

Example:

```
typechain --force --outDir app/contracts './node_modules/neufund-contracts/build/contracts/*.json'
```

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
interface for interacting with blockchain.

In future we plan to leverage something like tsc plugin system to come up with much more elegant
solution. You can keep track of
[Allow "Compiler Plugins"](https://github.com/Microsoft/TypeScript/issues/16607) issue.

### Step by step guide

Install typechain with `yarn add --dev typechain`.

Run `typechain` (you might need to make sure that it's available in your path if you installed it
only locally), it will automatically find all `.abi` files in your project and generate Typescript
classes based on them. You can specify your glob pattern: `typechain "**/*.abi.json"`.
`node_modules` are always ignored. Use `--force` to overwrite already existing files. We recommend
git ignoring these generated files and making typechain part of your build process.

That's it! Now, just import contract bindings as any other file `import { MyAwesomeContract } from
'./contracts/MyAwesomeContract'` and start interacting with it. We use named exports because of
[this](https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad).

### API

Let's take a look at typings generated for simple
[smartcontract](https://github.com/Neufund/TypeChain/blob/master/test/integration/contracts/DumbContract.sol):

```typescript
import { BigNumber } from "bignumber.js";
import {
  TypeChainContract,
  promisify,
  ITxParams,
  IPayableTxParams,
  DeferredTransactionWrapper
} from "./typechain-runtime";

export class DumbContract extends TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string) {
    const abi = [
      // ... ABI
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(web3: any, address: string): Promise<DumbContract> {
    const contract = new DumbContract(web3, address);
    const code = await promisify(web3.eth.getCode, [address]);
    if (code === "0x0") {
      throw new Error(`Contract at ${address} doesn't exist!`);
    }
    return contract;
  }

  public get counter(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.counter, []);
  }
  public get SOME_VALUE(): Promise<boolean> {
    return promisify(this.rawWeb3Contract.SOME_VALUE, []);
  }
  public counterArray(index: BigNumber | number): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.counterArray, [index]);
  }
  public returnAll(): Promise<[BigNumber, BigNumber]> {
    return promisify(this.rawWeb3Contract.returnAll, []);
  }
  public counterWithOffset(offset: BigNumber | number): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.counterWithOffset, [offset]);
  }

  public countupForEtherTx(): DeferredTransactionWrapper<IPayableTxParams> {
    return new DeferredTransactionWrapper<IPayableTxParams>(this, "countupForEther", []);
  }
  public countupTx(offset: BigNumber | number): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, "countup", [offset]);
  }
}
```

Using it can be as simple as:

```typescript
const dumbContract = await DumbContract.createAndValidate(web3, contractAddress);

console.log(`Current counter value is: ${await dumbContract.counter}`);

console.log("Lets increase it by 2... This results in state change so we need to create tx.");
await dumbContract.countupTx(2).send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });

console.log(`Current counter value is: ${await dumbContract.counter}`);

console.log("We can also get signed tx data: ");
console.log(await dumbContract.countupTx(2).getData());

console.log("When calling payable txs, TypeChain will make sure that you provide ether value:");
await dumbContract
  .countupForEtherTx()
  .send({ from: accounts[0], gas: GAS_LIMIT_STANDARD, value: 10 });
console.log(`Current counter value is: ${await dumbContract.counter}`);
```

which gives following output:

```
Current counter value is: 0
Lets increase it by 2... This results in state change so we need to create tx.
Current counter value is: 2
We can also get signed tx data:
0x7916df080000000000000000000000000000000000000000000000000000000000000002
When calling payable txs, TypeChain will make sure that you provide ether value:
Current counter value is: 12
```

## FAQ 🤔

### Q: Should I commit generated files to my repository?

A: _NO_ — we believe that no generated files should go to git repository. You should git ignore them
and make `typechain` run automatically for example in post install hook in package.json:

```
"postinstall":"typechain"
```

When you update ABI, just regenerate files with TypeChain and Typescript compiler will find any
breaking changes for you.

### Q: How do I customize generated classes?

A: You can create your own class that extends generated one and adds additional methods etc.

Currently we discuss various ideas around extendibility including APIs files (adding semantics to
ABIs for covering popular cases like working with dates) or using user-defined templates for
generated code.

### Q: Generated files won't match current codestyle of my project  :(

A: We will automatically format generated classes with `prettier` to match your coding preferences (just make sure to use `.prettierrc` file). Furthermore, we will silent tslint for generated files with `/* tslint:disable */` comments.

### Usage as API

You might also use TypeChain as api:

```typescript
import { generateTypeChainWrappers } from "../lib/generateTypeChainWrappers";

async function main() {
  await generateTypeChainWrappers({
    glob: "**/*.abi",
    force: true,
  });
}

main().catch(console.error);
```

other interesting methods are: `abiToWrapper` and `copyRuntime`.

## Roadmap 🛣️

* improve generated code (more checks, wiring contracts together)

### Running tests

```
yarn        # install all dependencies
yarn test   # runs tests + linting
```

### Debugging 🐞

```sh
DEBUG=typechain typechain
```


Original author:

Krzysztof Kaczor | [Github](https://github.com/krzkaczor) | [Twitter](https://twitter.com/krzkaczor)