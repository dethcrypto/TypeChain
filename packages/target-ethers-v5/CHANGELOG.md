# @typechain/ethers-v5

## 5.0.0
### Major Changes

- 0d4b293: Changed return type of functions from a object with number indexes, to an array merged with object containing named
  outputs.
  
  Before, solidity function like this:
  
  ```
  function x() public pure returns (uint256)
  ```
  
  Generated such method signature:
  
  ```typescript
  x(overrides?: CallOverrides): Promise<{0: BigNumber}>;
  ```
  
  New output is:
  
  ```typescript
  x(overrides?: CallOverrides): Promise<[BigNumber]>;
  ```
  
  The difference is that now you can use standard array destructuring while working with output types.

### Patch Changes

- db5baa5: Do not generate typings in contract type itself for reserved keywords that would collide with ethers internals
