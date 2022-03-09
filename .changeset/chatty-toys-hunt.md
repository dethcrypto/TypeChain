---
'@typechain/hardhat': major
'@typechain/ethers-v5': major
'@typechain/web3-v1': major
'typechain': major
---

Directory tree in generated types now reflects the directory tree in the inputs.
Also, only the main contract type is reexported from each file.

This change solves a number of name clashing problems.
All generated code can still be imported after updating the import path.
