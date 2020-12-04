---
'@typechain/ethers-v4': major
'@typechain/ethers-v5': major
---

Changed return type of functions from a object with number indexes, to an array merged with object containing named
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
