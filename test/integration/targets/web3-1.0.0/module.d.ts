declare module 'web3-eth-contract'{
  import BN = require('bn.js');
  import {provider} from 'web3-providers';
  import {AbiInput, AbiOutput, AbiItem} from 'web3-utils';

  interface EventLog {
    event: string;
    address: string;
    returnValues: any;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    raw?: {data: string; topics: any[]};
  }

  interface Log {
    address: string;
    data: string;
    topics: Array<string | string[]>;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
  }

  interface TransactionReceipt {
    status: boolean;
    transactionHash: string;
    transactionIndex: number;
    blockHash: string;
    blockNumber: number;
    from: string;
    to: string;
    contractAddress?: string;
    cumulativeGasUsed: number;
    gasUsed: number;
    logs: Log[];
    logsBloom: string;
    events?: {
      [eventName: string]: EventLog;
    };
  }

  interface PromiEvent<T> extends Promise<T> {
    once(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;

    once(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;

    once(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;

    once(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    once(
      type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;

    on(type: 'transactionHash', handler: (receipt: string) => void): PromiEvent<T>;

    on(type: 'receipt', handler: (receipt: TransactionReceipt) => void): PromiEvent<T>;

    on(type: 'confirmation', handler: (confNumber: number, receipt: TransactionReceipt) => void): PromiEvent<T>;

    on(type: 'error', handler: (error: Error) => void): PromiEvent<T>;

    on(
      type: 'error' | 'confirmation' | 'receipt' | 'transactionHash',
      handler: (error: Error | TransactionReceipt | string) => void
    ): PromiEvent<T>;
  }

  export class Contract {
    constructor(
      provider: provider,
      abi: AbiItem[],
      address?: string,
      options?: ContractOptions
    )

    address: string;
    jsonInterface: AbiModel;

    options: Options;

    clone(): Contract;

    deploy(options: DeployOptions): ContractSendMethod;

    methods: any;

    once(event: string, callback: (error: Error, event: EventData) => void): void;
    once(event: string, options: EventOptions, callback: (error: Error, event: EventData) => void): void;

    events: any;

    getPastEvents(event: string): Promise<EventData[]>;
    getPastEvents(event: string, options: EventOptions, callback: (error: Error, event: EventData) => void): Promise<EventData[]>;
    getPastEvents(event: string, options: EventOptions): Promise<EventData[]>;
    getPastEvents(event: string, callback: (error: Error, event: EventData) => void): Promise<EventData[]>;
  }

  export interface Options {
    address: string;
    data: string;
  }

  export interface DeployOptions {
    data: string;
    arguments?: any[];
  }

  export interface ContractSendMethod {
    send(options: SendOptions, callback?: (err: Error, transactionHash: string) => void): PromiEvent<Contract>;

    estimateGas(options: EstimateGasOptions, callback?: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(callback: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(options: EstimateGasOptions, callback: (err: Error, gas: number) => void): Promise<number>;

    estimateGas(options: EstimateGasOptions): Promise<number>;

    estimateGas(): Promise<number>;

    encodeABI(): string;
  }

  export interface SendOptions {
    from: string;
    gasPrice?: string;
    gas?: number;
    value?: number | string | BN;
  }

  export interface EstimateGasOptions {
    from?: string;
    gas?: number;
    value?: number | string | BN;
  }

  export interface ContractOptions {
    from: string;
    gasPrice: string;
    gas: number;
    data: string;
  }

  export interface EventOptions {
    filter?: {};
    fromBlock?: number;
    toBlock?: string | number;
    topics?: any[];
  }

  export interface EventData {
    returnValues: {
      [key: string]: any;
    },
    raw: {
      data: string;
      topics: string[];
    },
    event: string;
    signature: string;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
    address: string;
  }

  export interface AbiModel {
    getMethod(name: string): AbiItemModel | false;

    getMethods(): AbiItemModel[];

    hasMethod(name: string): boolean;

    getEvent(name: string): AbiItemModel | false;

    getEvents(): AbiItemModel[];

    getEventBySignature(signature: string): AbiItemModel;

    hasEvent(name: string): boolean;
  }

  export interface AbiItemModel {
    signature: string;
    name: string;
    payable: boolean;
    anonymous: boolean;

    getInputLength(): number;

    getInputs(): AbiInput[];

    getIndexedInputs(): AbiInput[];

    getOutputs(): AbiOutput[];

    isOfType(): boolean;
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
    raw?: {data: string; topics: any[]};
  }
}