---
"@typechain/ethers-v5": minor
---

The method overloads for:

```
getEvent
getFunction
decodeFunctionResult
encodeFunctionData
```
follow these rules:

• If these entities are not overloaded in the contract ABI and `--always-generate-overloads` is off, just the entities' names are used (without the signature)
• If the entities are overloaded, only signatures are used to disambiguate them
• If `--always-generate-overloads` is on, additional overloads are generated for functions that are not ambiguous
• For the method and event names in the events and functions properties only signature names are used (that's according to the ethers API - they don't use shorthand naming).
