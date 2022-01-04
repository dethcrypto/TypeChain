---
'@typechain/ethers-v4': patch
'@typechain/ethers-v5': patch
---

Events with multiple positional parameters no longer get "undefined" as argument in `contract.filters`.

https://github.com/dethcrypto/TypeChain/issues/575
