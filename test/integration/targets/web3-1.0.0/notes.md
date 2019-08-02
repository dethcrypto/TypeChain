Old Web3 version is 1.0.0-beta.54. Replacing with version 1.2.0 stable.

The declaration for version 1.2.0 only takes 1-2 arguments. This code must be changed.

```
const web3 = new Web3(ganache.provider(), undefined, {
  transactionConfirmationBlocks: 1,
});
```

Testing with:

```
const web3 = new Web3(ganache.provider());
```

Test passed.

However, remaining errors include "Missing declaration files [...] implicitely has any type." This error occurs for all web3 modules. Was fixed for `web3` by installing `@types/web3`, however this did not fix it for `web3-eth-contracts`, `web3-core`, etc.

Instead of writing a declaration file for each, these issues were patched by adding `"noImplicitAny": false` to `tsconfig.json`.



