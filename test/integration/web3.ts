import * as ganache from "ganache-cli";

import * as Web3 from "web3";
import { promisify } from "bluebird";

export const GAS_LIMIT_STANDARD = 6000000;

export let web3: Web3;
export let accounts: string[];

export async function createNewBlockchain() {
  const web3 = new Web3(ganache.provider());
  const accounts = await promisify(web3.eth.getAccounts, { context: web3.eth })();
  return { web3, accounts };
}

before(async () => {
  const r = await createNewBlockchain();
  web3 = r.web3;
  accounts = r.accounts;
});
