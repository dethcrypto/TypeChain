exports['ContractWithOverloads should snapshot generated code 1'] = `
/* tslint:disable */

import { BigNumber } from "bignumber.js";
import * as TC from "./typechain-runtime";

export class ContractWithOverloads extends TC.TypeChainContract {
  public readonly rawWeb3Contract: any;

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: true,
        inputs: [{ name: "offset", type: "uint256" }],
        name: "getCounter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "counter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "getCounter",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [{ name: "by", type: "uint256" }],
        name: "increaseCounter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: false,
        inputs: [],
        name: "increaseCounter",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    super(web3, address, abi);
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber,
  ): Promise<ContractWithOverloads> {
    const contract = new ContractWithOverloads(web3, address);
    const code = await TC.promisify(web3.eth.getCode, [address]);

    // in case of missing smartcontract, code can be equal to "0x0" or "0x" depending on exact web3 implementation
    // to cover all these cases we just check against the source code length — there won't be any meaningful EVM program in less then 3 chars
    if (code.length < 4) {
      throw new Error(\`Contract at \${address} doesn't exist!\`);
    }
    return contract;
  }

  public get counter(): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.counter, []);
  }

  public getCounter(offset: BigNumber | number): Promise<BigNumber> {
    return TC.promisify(this.rawWeb3Contract.getCounter, [offset.toString()]);
  }

  public increaseCounterTx(by: BigNumber | number): TC.DeferredTransactionWrapper<TC.ITxParams> {
    return new TC.DeferredTransactionWrapper<TC.ITxParams>(this, "increaseCounter", [
      by.toString(),
    ]);
  }
}

`
