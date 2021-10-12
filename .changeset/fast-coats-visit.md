---
'typechain': patch
---

Propagate module resolution errors from inside of target.

Previously, when the version of `@typechain/ethers-v5` you were depending on was in some way broken, `typechain` would
just say that it could not find a target. Now, an error message will explain _why_.
