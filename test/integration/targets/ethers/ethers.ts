const ganache = require("ganache-cli");

import { Contract, ContractFactory, Signer } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import { join } from "path";
import { readFileSync } from "fs";

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

export function getContractFactory(contractName: string): ContractFactory {
  const abiDirPath = join(__dirname, "../../abis");

  const abi = JSON.parse(readFileSync(join(abiDirPath, contractName + ".abi"), "utf-8"));
  const bin = readFileSync(join(abiDirPath, contractName + ".bin"), "utf-8");
  const code = "0x" + bin;
  return new ContractFactory(abi, code, signer);
}

export async function deployContract(contractName: string): Promise<Contract> {
  const factory = getContractFactory(contractName);
  return factory.deploy();
}

after(async () => {
  server.close();
});
