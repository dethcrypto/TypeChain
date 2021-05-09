---
'@typechain/ethers-v5': patch
---

Generated types now extend new `BaseContract` not `Contract` from ethers. This removes all index signatures and makes
calling a non-existing function a compile-time error.
