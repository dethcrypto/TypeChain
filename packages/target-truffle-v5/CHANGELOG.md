# @typechain/truffle-v5

## 5.1.0

### Minor Changes

- b3c94a1: Adds overrides introduced by EIP-1559.

## 5.0.0

### Patch Changes

- Updated dependencies [d60a343]
- Updated dependencies [5a60d00]
- Updated dependencies [d60a343]
  - typechain@5.0.0

## 4.0.1

### Patch Changes

- ebaeffc: Add missing properties to `Truffle.ContractInstance`

## 4.0.0

### Major Changes

- f8711eb: Changed return type of functions from an array to a object. This represents better runtime types.

  Before, solidity function like this:

  ```
  function x() public pure returns (uint256)
  ```

  Generated such method signature:

  ```typescript
  x(txDetails?: Truffle.TransactionDetails): Promise<[BigNumber]>;
  ```

  New output is:

  ```typescript
  x(txDetails?: Truffle.TransactionDetails): Promise<{0: BigNumber}>;
  ```

  The difference is that now you can use standard object destructuring while working with output types.
