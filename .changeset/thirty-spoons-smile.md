---
'@typechain/ethers-v5': patch
---

Fix type generation for arrays of nested structs ex: `GovernanceMessage.Call[][] calldata _remoteCalls`.
