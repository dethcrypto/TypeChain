const ganache = require("ganache-cli");

import Web3 from "web3";
import { join } from "path";
import { readFileSync } from "fs";

export const GAS_LIMIT_STANDARD = 1000000;

export let web3: Web3;
export let accounts: string[];

export async function createNewBlockchain() {
  const web3 = new Web3(ganache.provider(), undefined, {
    transactionConfirmationBlocks: 1,
  });
  const accounts = await web3.eth.getAccounts();
  return { web3, accounts };
}

before(async () => {
  const r = await createNewBlockchain();
  web3 = r.web3;
  accounts = r.accounts;
});

export async function deployContract<T>(contractName: string, ...args: any[]): Promise<T> {
  const abiDirPath = join(__dirname, "../../abis");

  const abi = JSON.parse(readFileSync(join(abiDirPath, contractName + ".abi"), "utf-8"));
  const bin = readFileSync(join(abiDirPath, contractName + ".bin"), "utf-8");
  const code = "0x" + bin;

  const Contract = new web3.eth.Contract(abi);
  const t = Contract.deploy({ arguments: args, data: code });

  return (await (t.send({
    from: accounts[0],
    gas: GAS_LIMIT_STANDARD,
  }) as any)) as T;
}

export function isBigNumber(object: any): boolean {
  // Cribbed from web3-utils until BNs/BigNumbers are resolved in web3
  // https://github.com/ethereum/web3.js/issues/2468
  return object && object.constructor && object.constructor.name === "BigNumber";
}
