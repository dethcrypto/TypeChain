---
'@typechain/ethers-v5': patch
'typechain': patch
---

Constant size struct arrays are now properly supported and don't cause malformed TS emit anymore.
