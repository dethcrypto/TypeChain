---
'@typechain/hardhat': patch
'@typechain/hardhat-test': patch
'@typechain/ethers-v5': patch
---

Fixed generated contract factory constructors to accept 3 parameters when called from ContractFactory methods
(`this.constructor(interface, bytecode, signer)`).

Fixes https://github.com/dethcrypto/TypeChain/issues/487
