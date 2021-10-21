---
'@typechain/ethers-v5': minor
'typechain': minor
---

Add support for Solidity structs

```ts
// before
function deposit(amount: { token: string; value: BigNumberish }): Promise<ContractTransaction>

// after
export type AmountStruct = { token: string; value: BigNumberish }

function deposit(amount: AmountStruct): Promise<ContractTransaction>
```
