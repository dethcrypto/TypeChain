import { BigNumber } from "bignumber.js";

export interface ITxParams {
  from?: string;
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
}

export interface IPayableTxParams {
  value: string | number | BigNumber;
  from?: string;
  gas?: number | string | BigNumber;
  gasPrice?: number | string | BigNumber;
}

export class TypechainContract {
  public rawWeb3Contract: any;

  constructor(web3: any, public address: string, protected contractAbi: object) {
    this.rawWeb3Contract = web3.eth.contract(contractAbi).at(address);
  }
}

export class DeferredTransactionWrapper<T extends ITxParams> {
  constructor(
    private parentContract: TypechainContract,
    private methodName: string,
    private methodArgs: any[]
  ) {}

  send(params: T): Promise<string> {
    return promisify(this.parentContract.rawWeb3Contract[this.methodName].sendTransaction, [
      ...this.methodArgs,
      params
    ]);
  }

  getData(): string {
    return this.parentContract.rawWeb3Contract[this.methodName].getData(
      ...this.methodArgs
    ) as string;
  }
}

export function promisify(func: any, args: any): Promise<any> {
  return new Promise((res, rej) => {
    func(...args, (err: any, data: any) => {
      if (err) return rej(err);
      return res(data);
    });
  });
}
