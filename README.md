# Typechain

🔌 Typescript bindings for Ethereum smartcontracts

## Installation

```bash
npm install --save-dev typechain
```

```bash
yarn add --dev typechain
```

## Usage

```
typechain [--force] [glob]
```

## Features ⚡
 - static typing - you will never call not existing method again 
 - IDE support - works with any IDE supporting Typescript
 - revamped API - native promises, safety checks and more!
 - compatibility - under the hood it uses web3 so it's 100% compatible

## Demo 🏎️

![Demo](https://media.giphy.com/media/l1J9CYJCRtMVSSPK0/giphy.gif)

*[fullsize](https://zippy.gfycat.com/DimBruisedBlacknorwegianelkhound.mp4)*

[Example repo](https://github.com/krzkaczor/Typechain-example)

## Getting started 📚 

### Motivation
Interacting with blockchain in Javascript is a pain. Web3 interface is sluggish and when you want to interact with a smartcontract already deployed it only gets worse. Often, you can't be sure what given method call will actually do without looking at ABI file. Typechain is here to solve these problems (as long as you use Typescript).

### How does it work?
Typechain is just a code generator - provide ABI file and you will get Typescript class with flexible interface for interacting with blockchain. 

In future we plan to leverage something like tsc plugin system to come up with much more elegant solution. You can keep track of [Allow "Compiler Plugins"](https://github.com/Microsoft/TypeScript/issues/16607) issue.

### Step by step guide
Install typechain with `yarn add --dev typechain`. 

Run `typechain` (you might need to make sure that it's available in your path if you installed it only locally), it will automatically find all `.abi` files in your project and generate Typescript classes based on them. You can specify your glob pattern: `typechain "**/*.abi.json"`. `node_modules` are always ignored. Use `--force` to overwrite already existing files. We recommend git ignoring these generated files and making typechain part of your build process.

That's it! Now, just import contract bindings as any other file `import MyAwesomeContract from './contracts/MyAwesomeContract'` and start interacting with it.

### API
Let's take a look at typings generated for simple [smartcontract](https://github.com/krzkaczor/Typechain-example/blob/master/truffle/contracts/DumbContract.sol):

```typescript
// interface specifying transaction options
interface ITxParams {
  from?: string;
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
}

declare class Contract {
  public constructor(web3: any, address: string);
   // alternative way for connecting to blockchain contract. Makes sure that contract exists. Without that web3 would happily return zero/null values for any constant value / function.
  static createAndValidate(web3: any, address: string): Promise<Contract>;

  // getters are translated as getters
  public readonly someValue: Promise<boolean>;
  public readonly counter: Promise<BigNumber>;

  // constant functions are just methods
  public returnAll(): Promise<[BigNumber, BigNumber]>; // tuples in solidity are tuples in TS
  public counterWithOffset(offset: BigNumber): Promise<BigNumber>;

  // transactions are method with "Tx" postfix and additional parameter allowing for specifying transaction related options
  public countupTx(params?: ITxParams): Promise<void>;
}
```

## Roadmap 🛣️
 - support for all solidity types
 - transaction support
 - improve generated code (autoformatting, more checks, wiring contracts together)


 #### Running tests
 You need to have `solc ^0.4.4` installed on your system. Then just do `yarn test`.

 #### Debugging 🐞
 ```sh
 DEBUG=typechain typechain
 ```