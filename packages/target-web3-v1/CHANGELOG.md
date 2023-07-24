# @typechain/web3-v1

## 6.0.6

### Patch Changes

- Updated dependencies [9107713]
  - typechain@8.3.1

## 6.0.5

### Patch Changes

- Updated dependencies [c4720b9]
  - typechain@8.3.0

## 6.0.4

### Patch Changes

- Updated dependencies [cd4bb0f]
  - typechain@8.2.1

## 6.0.3

### Patch Changes

- Updated dependencies [15541e4]
  - typechain@8.2.0

## 6.0.2

### Patch Changes

- Updated dependencies [bbc9656]
  - typechain@8.1.1

## 6.0.1

### Patch Changes

- Updated dependencies [63691c4]
  - typechain@8.1.0

## 6.0.0

### Major Changes

- 3a8a99a: Directory tree in generated types now reflects the directory tree in the inputs. Also, only the main contract
  type is reexported from each file.

  This change solves a number of name clashing problems. All generated code can still be imported after updating the
  import path.

### Minor Changes

- e447bfb: Added optional `config.inputDir` property and `--input-dir` flag to control directory structure in generated
  types. If not set, it's inferred as lowest common path of all ABI files.
- a59ae6e: Prefer `import type` in generated files when possible

### Patch Changes

- Updated dependencies [3a8a99a]
- Updated dependencies [5b9a7fb]
- Updated dependencies [e447bfb]
- Updated dependencies [978490f]
- Updated dependencies [a59ae6e]
- Updated dependencies [975a9dc]
- Updated dependencies [e1f832c]
  - typechain@8.0.0

## 5.0.0

### Patch Changes

- Updated dependencies [92939ea]
- Updated dependencies [d244e41]
  - typechain@7.0.0

## 4.0.0

### Major Changes

- 0e555af: Generate types to `.ts` files instead of `.d.ts` in Ethers v5 and Web3.js targets

### Patch Changes

- Updated dependencies [0ac4921]
- Updated dependencies [95517e9]
- Updated dependencies [33ee803]
  - typechain@6.0.0

## 3.1.0

### Minor Changes

- b3c94a1: Adds overrides introduced by EIP-1559.

## 3.0.0

### Patch Changes

- Updated dependencies [d60a343]
- Updated dependencies [5a60d00]
- Updated dependencies [d60a343]
  - typechain@5.0.0

## 2.2.0

### Minor Changes

- 7f18b27: Accept BN as input for numbers

## 2.1.0

### Minor Changes

- 5761302: Support passing block number to call functions
