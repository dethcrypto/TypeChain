# @typechain/hardhat

## 2.3.0

### Minor Changes

- 99ce3e3: Move type generation to Hardhat subtask for easier third-party integration

## 2.2.0

### Minor Changes

- 21a5062: Always use hardhat project root as cwd while generating types. All paths in the config are now always
  relative to the project root as well.

## 2.1.2

### Patch Changes

- 5ed62e4: Ensure that `type-extensions.ts` is always imported

## 2.1.1

### Patch Changes

- 5980201: Expose `TASK_TYPECHAIN` constant

## 2.1.0

### Minor Changes

- 22134ac: Support compilation of external artifacts (from node_modules)

## 2.0.2

### Patch Changes

- e552df9: Add missing dependency on `fs-extra`

## 2.0.1

### Patch Changes

- b705685: Fix bug which caused targets not supporting incremental generation to misbehave when editing files
- 30c4565: Add ability to run custom targets with hardhat

## 2.0.0

### Minor Changes

- 62b9e08: Type `getContractFactory` calls
- 62b9e08: Support incremental generation

### Patch Changes

- Updated dependencies [d60a343]
- Updated dependencies [5a60d00]
- Updated dependencies [d60a343]
  - typechain@5.0.0

## 1.0.1

### Patch Changes

- 23faae4: Accept underscores in contract names

## 1.0.0

### Major Changes

- cd8b04b: Initial release
