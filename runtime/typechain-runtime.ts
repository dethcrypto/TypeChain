/* tslint:disable */
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

export interface IWatchFilter {
  fromBlock?: string | number;
  toBlock?: string | number;
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

type WatchEventCallback<Event> = (err: any, log: DecodedLogEntry<Event>) => void;
type GetEventCallback<Event> = (err: any, logs: DecodedLogEntry<Event>[]) => void;
type RawEvent<Event> = {
  watch: (cb: WatchEventCallback<Event>) => void;
  get: (cb: GetEventCallback<Event>) => void;
  stopWatching: () => void;
};

export class DeferredEventWrapper<Event, EventIndexedFields> {
  constructor(
    private readonly parentContract: TypeChainContract,
    private readonly eventName: string,
    private readonly eventArgs?: EventIndexedFields,
  ) {}

  public watchFirst(watchFilter: IWatchFilter): Promise<DecodedLogEntry<Event>> {
    return new Promise((resolve, reject) => {
      const watchedEvent = this.getRawEvent(watchFilter);
      watchedEvent.watch((err: any, res: any) => {
        // this makes sure to unsubscribe as well
        watchedEvent.stopWatching();
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public watch(
    watchFilter: IWatchFilter,
    callback: (err: any, event: DecodedLogEntry<Event>) => void,
  ): () => void {
    const watchedEvent = this.getRawEvent(watchFilter);
    watchedEvent.watch(callback);

    return () => {
      watchedEvent.stopWatching();
    };
  }

  public get(watchFilter: IWatchFilter): Promise<DecodedLogEntry<Event>[]> {
    return new Promise<DecodedLogEntry<Event>[]>((resolve, reject) => {
      const watchedEvent = this.getRawEvent(watchFilter);
      watchedEvent.get((err, logs) => {
        if (err) {
          reject(err);
        } else {
          resolve(logs);
        }
      });
    });
  }

  private getRawEvent(watchFilter: IWatchFilter): RawEvent<Event> {
    const filter: IWatchFilter = Object.assign({}, watchFilter, {
      fromBlock: "0",
      toBlock: "latest",
    });
    const rawEvent = this.parentContract.rawWeb3Contract[this.eventName](this.eventArgs, filter);

    return rawEvent;
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
