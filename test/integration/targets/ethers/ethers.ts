const ganache = require("ganache-cli");

import { Signer } from "ethers";
import { JsonRpcProvider } from "ethers/providers";

let signer: Signer;
let server: any;

export async function createNewBlockchain() {
  const server = ganache.server();
  server.listen(8545, () => {});
  const provider = new JsonRpcProvider();
  const signer = provider.getSigner(0);
  return { server, signer };
}

before(async () => {
  ({ server, signer } = await createNewBlockchain());
});

export function getTestSigner(): Signer {
  return signer;
}

after(async () => {
  server.close();
});
