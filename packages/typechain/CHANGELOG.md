# typechain

## 6.0.2

### Patch Changes

- c6b6e5f: Remove unnecessary console.log about structs internals

## 6.0.1

### Patch Changes

- 44a04c0: Fix bug in parsing names of free floating structs

## 6.0.0

### Major Changes

- 33ee803: Fix tuple array signature

### Minor Changes

- 95517e9: Add support for Solidity structs

  ```ts
  // before
  function deposit(amount: { token: string; value: BigNumberish }): Promise<ContractTransaction>

  // after
  export type AmountStruct = { token: string; value: BigNumberish }

  function deposit(amount: AmountStruct): Promise<ContractTransaction>
  ```

### Patch Changes

- 0ac4921: Propagate module resolution errors from inside of target.

  Previously, when the version of `@typechain/ethers-v5` you were depending on was in some way broken, `typechain` would
  just say that it could not find a target. Now, an error message will explain _why_.

## 5.2.0

### Minor Changes

- c7c2913: Escaped reserved words in argument names

## 5.1.2

### Patch Changes

- a3feb27: Support extracting library references in hardhat style artifacts

## 5.1.1

### Patch Changes

- b4fac2d: Add missing runtime dep

## 5.1.0

### Minor Changes

- 22134ac: Support optional `ignoreNodeModules`(default=true) flag for glob helper

## 5.0.0

### Major Changes

- d60a343: Rename `--outDir` CLI option to `--out-dir`
- 5a60d00: Remove dependency on `ts-generator`

### Minor Changes

- d60a343: Add `--always-generate-overloads` option and by default stop generating types for overloaded functions if
  there are no overloads (reduces bloat)

## 4.0.3

### Patch Changes

- dbfe92a: Improve error message in case of a missing target

## 4.0.2

### Patch Changes

- d07ae43: Fix signature of overloaded methods with struct in arguments

## 4.0.1

### Patch Changes

- 82633bb: Do not ship tests and original source files with the npm package
