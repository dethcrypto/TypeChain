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
    this.rawWeb3Contract = web3.eth.contract(contractAbi).at(address);
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
      const tmpContract = customWeb3.eth
        .contract(this.parentContract.contractAbi)
        .at(this.parentContract.address);
      method = tmpContract[this.methodName].sendTransaction;
    } else {
      method = this.parentContract.rawWeb3Contract[this.methodName].sendTransaction;
    }

    return promisify(method, [...this.methodArgs, params]);
  }

  getData(): string {
    return this.parentContract.rawWeb3Contract[this.methodName].getData(
      ...this.methodArgs,
    ) as string;
  }
}

export class DeferredEventWrapper<Event, EventIndexedFields> {
  constructor(
    private readonly parentContract: TypeChainContract,
    private readonly eventName: string,
    private readonly eventArgs?: EventIndexedFields,
  ) {}

  public watchFirst(): Promise<DecodedLogEntry<Event>> {
    return new Promise((resolve, reject) => {
      const watcher = this.parentContract.rawWeb3Contract[this.eventName](
        this.eventArgs,
        (err: any, res: any) => {
          // this makes sure to unsubscribe as well
          watcher.stopWatching((err2: any) => {
            if (err) {
              reject(err);
            } else if (err2) {
              reject(err2);
            } else {
              resolve(res);
            }
          });
        },
      );
    });
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

// tslint:disable-next-line
export interface LogEntry {
  logIndex: number | null;
  transactionIndex: number | null;
  transactionHash: string;
  blockHash: string | null;
  blockNumber: number | null;
  address: string;
  data: string;
  topics: string[];
}

// tslint:disable-next-line
export interface DecodedLogEntry<A> extends LogEntry {
  event: string;
  args: A;
}

interface IDictionary<T = string> {
  [id: string]: T;
}
