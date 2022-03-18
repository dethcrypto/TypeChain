---
'@typechain/ethers-v5': minor
---

For every event, TypeChain now emits an interface with its named properties.

**Before**

```ts
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  { owner: string; approved: string; tokenId: BigNumber }
>
```

**After**

```ts
export interface ApprovalEventObject {
  owner: string
  approved: string
  tokenId: BigNumber
}
export type ApprovalEvent = TypedEvent<[string, string, BigNumber], ApprovalEventObject>
```
