# Typechain

🔌 Typescript bindings for Ethereum smartcontracts

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
Interacting with blockchain in Javascript is a pain. Web3 interface is sluggish and when you want to interact with a smartcontract already deployed it only gets worse. Often, you can't be sure what given method call will actually do without looking at ABI file. Typechain is here to solve these problems (at least as long as you use Typescript).

### How does it work?
First, Typechain generates Typescript typings based on smartcontract's ABI. Then it uses webpack loader to load custom implementation when pointing to `.abi` file. Currently it works only with webpack but in future we plan to support node with similar, flexible api.

### Step by step guide

Install typechain with `yarn add --dev typechain`. Initially you need to generate typings based on ABI files. Just run `typechain` (you might need to make sure that it's available in your path if you installed it only locally), it will automatically find all `.abi` files in your project and generate typings for them.  Make sure to git ignore these generated typings - you can add something like: `*.abi.d.ts`.

Last step is adding our webpack loader. It's easy: 
```javascript
module :{
  ...
  rules: [
    ...
      { test: /\.abi?$/, loader: "typechain" },
  ]
}
```

That's it! Now, just import contract ABI as any other file `import MyAwesomeContract from './contracts/MyAwesomeContract.abi'` and start interacting with it.

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
 - improve generated code
 - node support
