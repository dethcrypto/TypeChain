---
'@typechain/hardhat': major
'@typechain/ethers-v5': major
'typechain': major
---

## What's breaking:

We are not emitting `contractName` fields on contracts and factories anymore.

## Why?

`contractName` breaks polymorphism for example: exact token implementation is not assignable to token interface.

## What do to?

We are adding optional flag `--discriminate-types` to continue emitting `contractName`.
