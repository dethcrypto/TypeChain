import { web3, accounts, GAS_LIMIT_STANDARD } from "../web3";
import { readFileSync } from "fs";
import { join } from "path";
import { Contract } from "web3/types";

export async function deployContract(contractName: string): Promise<Contract> {
  const dirPath = join(__dirname, "../abis");
  const fileName = `__${contractName}_sol_${contractName}`;

  const abi = JSON.parse(readFileSync(join(dirPath, fileName + ".abi"), "utf-8"));
  const bin = readFileSync(join(dirPath, fileName + ".bin"), "utf-8");
  const code = "0x" + bin;

  const contract = new web3.eth.Contract(abi);

  return contract
    .deploy({ data:code, arguments: [] })
    .send({ from: accounts[0], gas: GAS_LIMIT_STANDARD });
}
