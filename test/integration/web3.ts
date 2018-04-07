import * as ganache from "ganache-cli";
import Web3 from "web3";

export const GAS_LIMIT_STANDARD = 1000000;

export let web3: Web3;
export let accounts: string[];

export async function createNewBlockchain() {
  const Derp = require("web3");
  const web3 = new Derp(ganache.provider());
  const accounts = await web3.eth.getAccounts();
  return { web3, accounts };
}

before(async () => {
  const r = await createNewBlockchain();
  web3 = r.web3;
  accounts = r.accounts; 
});
