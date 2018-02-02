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

export class TypeChainContract {
  public readonly rawWeb3Contract: any;
  public readonly address: string;

  constructor(web3: any, address: string | BigNumber, public readonly contractAbi: object) {
    this.address = address.toString();
    this.rawWeb3Contract = new web3.eth.Contract(contractAbi, address);
  }
}

export class DeferredTransactionWrapper<T extends ITxParams> {
  constructor(
    private readonly parentContract: TypeChainContract,
    private readonly methodName: string,
    private readonly methodArgs: any[],
  ) {}

  send(params: T, customWeb3?: any): Promise<string> {
    let method: any;

    if (customWeb3) {
      const tmpContract = new customWeb3.eth.Contract(
        this.parentContract.contractAbi,
        this.parentContract.address,
      );

      method = tmpContract.methods[this.methodName].apply(tmpContract.methods, this.methodArgs);
    } else {
      method = this.parentContract.rawWeb3Contract.methods[this.methodName].apply(
        this.parentContract.rawWeb3Contract.methods,
        this.methodArgs,
      );
    }

    return method.send(params);
  }

  getData(): string {
    return this.parentContract.rawWeb3Contract.methods[this.methodName]
      .apply(this.parentContract.rawWeb3Contract.methods, this.methodArgs)
      .encodeABI();
  }
}
