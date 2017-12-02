import * as ganache from "ganache-cli";

import * as Web3 from "web3";
import { promisify } from "bluebird";

export const GAS_LIMIT_STANDARD = 1000000;

export let web3: Web3;
export let accounts: string[];

before(async () => {
  web3 = new Web3(ganache.provider());
  accounts = await promisify(web3.eth.getAccounts, { context: web3.eth })();
});
