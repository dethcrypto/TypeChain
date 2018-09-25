const providers = require('ethers').providers;
const ethers=require("ethers");
const Wallet=require("ethers").Wallet;
import Web3 = require("web3");
import { join } from "path";
import { readFileSync } from "fs";

export let account: string[];

export let web3: Web3;
export const GAS_LIMIT_STANDARD = 1000000;
    /**
     * should be changed to 7545 in case of ganache-cli
     */
export const web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
export const provider = new ethers.providers.Web3Provider(web3Provider);

export async function createNewBlockchain() {
     web3=new Web3(web3Provider);
     account=await provider.listAccounts();
     return {account,web3}
  }

  before(async () => {
    const r = await createNewBlockchain();
    web3=r.web3;
    account = r.account;
  });

  export async function deployContract<T>(contractName: string): Promise<T> {
    const abiDirPath = join(__dirname, "../../abis");
  
    const abi = JSON.parse(readFileSync(join(abiDirPath, contractName + ".abi"), "utf-8"));
    //bin Here should be the bytecode
    const bin = readFileSync(join(abiDirPath, contractName + ".bin"), "utf-8");
    const code = "0x" + bin;
  
    const contract = new web3.eth.Contract(abi);
  
    return await ((contract as any).new(
      { from: account[0], data: code, gas: GAS_LIMIT_STANDARD }
      )) as T;

  }