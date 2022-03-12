---
'@typechain/ethers-v5': patch
'typechain': major
---

Fix type generation for arrays of nested structs ex: `GovernanceMessage.Call[][] calldata _remoteCalls`.

Fix structs parser in typechain package. Now only struct tuples are registered.
