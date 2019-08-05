declare module 'web3-eth-contract'{
  import BN from "bn.js";

  type ABIDataTypes = "uint256" | "boolean" | "string" | "bytes" | string; // TODO complete list

  type BlockType = "latest" | "pending" | "genesis" | number;

  type PromiEventType = "transactionHash" | "receipt" | "confirmation" | "error";

  interface ABIDefinition {
    constant?: boolean;
    payable?: boolean;
    stateMutability?: "pure" | "view" | "nonpayable" | "payable";
    anonymous?: boolean;
    inputs?: Array<{ name: string; type: ABIDataTypes; indexed?: boolean }>;
    name?: string;
    outputs?: Array<{ name: string; type: ABIDataTypes }>;
    type: "function" | "constructor" | "event" | "fallback";
  }

  interface Callback<ResultType> {
    (error: Error): void;
    (error: null, val: ResultType): void;
  }

  interface contractOptions {
    address: string;
    jsonInterface: ABIDefinition[];
    data: string;
    from: string;
    gasPrice: string;
    gas: number;
  }

  interface CustomOptions {
    address?: string;
    jsonInterface?: ABIDefinition[];
    data?: string;
    from?: string;
    gasPrice?: string;
    gas?: number;
  }

  interface EventLog {
    event: string;
    address: string;
    returnValues: any;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    raw?: { data: string; topics: string[] };
  }

  interface EventEmitter {
    on(type: "data", handler: (event: EventLog) => void): EventEmitter;
    on(type: "changed", handler: (receipt: EventLog) => void): EventEmitter;
    on(type: "error", handler: (error: Error) => void): EventEmitter;
    on(
      type: "error" | "data" | "changed",
      handler: (error: Error | TransactionReceipt | string) => void
    ): EventEmitter;
  }

  interface JsonRPCRequest {
    jsonrpc: string;
    method: string;
    params: any[];
    id: number;
  }

  interface JsonRPCResponse {
    jsonrpc: string;
    id: number;
    result?: any;
    error?: string;
  }

  interface Log {
    address: string;
    data: string;
    topics: string[];
    logIndex: number;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
  }

  interface PromiEvent<T> extends Promise<T> {
    once(
      type: "transactionHash",
      handler: (receipt: string) => void
    ): PromiEvent<T>;
    once(
      type: "receipt",
      handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    once(
      type: "confirmation",
      handler: (confNumber: number, receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    once(type: "error", handler: (error: Error) => void): PromiEvent<T>;
    once(
      type: PromiEventType,
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
    on(
      type: "transactionHash",
      handler: (receipt: string) => void
    ): PromiEvent<T>;
    on(
      type: "receipt",
      handler: (receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    on(
      type: "confirmation",
      handler: (confNumber: number, receipt: TransactionReceipt) => void
    ): PromiEvent<T>;
    on(type: "error", handler: (error: Error) => void): PromiEvent<T>;
    on(
      type: "error" | "confirmation" | "receipt" | "transactionHash",
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
  }

  class Provider {
    send(payload: JsonRPCRequest, callback: Callback<JsonRPCResponse>): any;
  }

  interface Tx {
    nonce?: string | number;
    chainId?: string | number;
    from?: string;
    to?: string;
    data?: string;
    value?: string | number;
    gas?: string | number;
    gasPrice?: string | number;
  }

  interface TransactionObject<T> {
    arguments: any[];
    call(tx?: Tx): Promise<T>;
    send(tx?: Tx): PromiEvent<T>;
    estimateGas(tx?: Tx): Promise<number>;
    encodeABI(): string;
  }

  interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs?: Log[];
    events?: {
      [eventName: string]: EventLog;
    };
    status: boolean;
  }

  export interface EstimateGasOptions {
    from?: string;
    gas?: number;
    value?: number | string | BN;
  }

  export interface EventOptions {
    filter?: {};
    fromBlock?: number;
    toBlock?: string | number;
    topics?: any[];
  }

  export interface ContractOptions {
    address: string;
    jsonInterface: ABIDefinition[];
    data: string;
    from: string;
    gasPrice: string;
    gas: number;
  }

  export class Contract {
    constructor(
      jsonInterface: any[],
      address?: string,
      options?: CustomOptions
    );
    options: contractOptions;
    methods: {
      [fnName: string]: (...args: any[]) => TransactionObject<any>;
    };
    deploy(options: {
      data: string;
      arguments: any[];
    }): TransactionObject<Contract>;
    events: {
      [eventName: string]: (
        options?: {
          filter?: object;
          fromBlock?: BlockType;
          topics?: string[];
        },
        cb?: Callback<EventLog>
      ) => EventEmitter;
      allEvents: (
        options?: {
          filter?: object;
          fromBlock?: BlockType;
          topics?: string[];
        },
        cb?: Callback<EventLog>
      ) => EventEmitter;
    };
    getPastEvents(
      event: string,
      options?: {
        filter?: object;
        fromBlock?: BlockType;
        toBlock?: BlockType;
        topics?: string[];
      },
      cb?: Callback<EventLog[]>
    ): Promise<EventLog[]>;
    setProvider(provider: Provider): void;
  }

}

declare module 'web3-core' {
  export interface EventLog {
    event: string;
    address: string;
    returnValues: any;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    raw?: { data: string; topics: string[] };
  }
}