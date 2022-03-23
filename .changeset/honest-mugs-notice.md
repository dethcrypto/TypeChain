---
'@typechain/ethers-v5': minor
'@typechain/truffle-v5': minor
'@typechain/web3-v1': minor
'typechain': minor
---

Added optional `config.inputDir` property and `--input-dir` flag to control directory structure in generated types. If
not set, it's inferred as lowest common path of all ABI files.
