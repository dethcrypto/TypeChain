---
'@typechain/ethers-v5': major
---

Improve typings for events. Generate types for `queryFilter` for events.

Note: This is a breaking change as it requires using TypeScript >= 4.0.0 (previously 3.9 was fine.)

Example:

```typescript
const filter = contract.filters.Transfer() // TypedEventFilter<>
const result = await contract.queryFilter(filter) // TypedEvent<>

result[0].args.from // type support for named event parameters
result[0].args[0] // type support by index

contract.on(filter, (from, to, value, event) => {
  from // string
  to // string
  value // BigNumber
  event // TypedEvent<>
})
```
