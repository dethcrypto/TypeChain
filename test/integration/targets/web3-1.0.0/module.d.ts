declare module 'web3-eth-contract'{
  import BN = require('bn.js');
  import * as net from 'net';

  type AbiType = 'function' | 'constructor' | 'event' | 'fallback';

  type provider = HttpProvider | IpcProvider | WebsocketProvider | Web3EthereumProvider | CustomProvider | string | null;

  type Hex = string | number;

  type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';

  type Mixed =
    | string
    | number
    | BN
    | {
          type: string;
          value: string;
      }
    | {
          t: string;
          v: string | BN | number;
      }
    | boolean;


  type Unit =
    | 'noether'
    | 'wei'
    | 'kwei'
    | 'Kwei'
    | 'babbage'
    | 'femtoether'
    | 'mwei'
    | 'Mwei'
    | 'lovelace'
    | 'picoether'
    | 'gwei'
    | 'Gwei'
    | 'shannon'
    | 'nanoether'
    | 'nano'
    | 'szabo'
    | 'microether'
    | 'micro'
    | 'finney'
    | 'milliether'
    | 'milli'
    | 'ether'
    | 'kether'
    | 'grand'
    | 'mether'
    | 'gether'
    | 'tether';

  export class formatters {
    static outputBigNumberFormatter(number: number): number;
    static inputSignFormatter(data: string): string;
    static inputAddressFormatter(address: string): string;
    static isPredefinedBlockNumber(blockNumber: string): boolean;
    static inputDefaultBlockNumberFormatter(blockNumber: string, moduleInstance: AbstractWeb3Module): string;
    static inputBlockNumberFormatter(blockNumber: string | number): string | number;
    static outputBlockFormatter(block: object): object; // TODO: Create Block interface
    static txInputFormatter(txObject: object): object;
    static inputCallFormatter(txObject: object): object;
    static inputTransactionFormatter(txObject: object): object;
    static outputTransactionFormatter(receipt: object): object;
    static outputTransactionReceiptFormatter(receipt: object): object;
    static inputLogFormatter(log: object): object;
    static outputLogFormatter(log: object): object;
    static inputPostFormatter(post: object): object; // TODO: Create Post interface
    static outputPostFormatter(post: object): object; // TODO: Create Post interface
    static outputSyncingFormatter(result: object): object; // TODO: Create SyncLog interface
  }


  interface Units {
    noether: string;
    wei: string;
    kwei: string;
    Kwei: string;
    babbage: string;
    femtoether: string;
    mwei: string;
    Mwei: string;
    lovelace: string;
    picoether: string;
    gwei: string;
    Gwei: string;
    shannon: string;
    nanoether: string;
    nano: string;
    szabo: string;
    microether: string;
    micro: string;
    finney: string;
    milliether: string;
    milli: string;
    ether: string;
    kether: string;
    grand: string;
    mether: string;
    gether: string;
    tether: string;
  }

  interface Utils {
    isBN(value: string | number): boolean;
    isBigNumber(value: BN): boolean;
    toBN(value: number | string): BN;
    toTwosComplement(value: number | string | BN): string;
    isAddress(address: string, chainId?: number): boolean;
    isHex(hex: Hex): boolean;
    isHexStrict(hex: Hex): boolean;
    asciiToHex(string: string, length?: number): string;
    hexToAscii(string: string): string;
    toAscii(string: string): string;
    bytesToHex(bytes: number[]): string;
    numberToHex(value: number | string | BN): string;
    checkAddressChecksum(address: string, chainId?: number): boolean;
    fromAscii(string: string): string;
    fromDecimal(value: string | number): string;
    fromUtf8(string: string): string;
    fromWei(value: string | BN, unit?: Unit): string;
    hexToBytes(hex: Hex): number[];
    hexToNumber(hex: Hex): number;
    hexToNumberString(hex: Hex): string;
    hexToString(hex: Hex): string;
    hexToUtf8(string: string): string;
    keccak256(value: string | BN): string;
    padLeft(value: string | number, characterAmount: number, sign?: string): string;
    leftPad(string: string | number, characterAmount: number, sign?: string): string;
    rightPad(string: string | number, characterAmount: number, sign?: string): string;
    padRight(string: string | number, characterAmount: number, sign?: string): string;
    sha3(value: string | BN): string;
    randomHex(bytesSize: number): string;
    utf8ToHex(string: string): string;
    stringToHex(string: string): string;
    toChecksumAddress(address: string, chainId?: number): string;
    toDecimal(hex: Hex): number;
    toHex(value: number | string | BN): string;
    toUtf8(string: string): string;
    toWei(val: BN, unit?: Unit): BN;
    toWei(val: string, unit?: Unit): string;
    isBloom(bloom: string): boolean;
    isTopic(topic: string): boolean;
    jsonInterfaceMethodToString(abiItem: AbiItem): string;
    soliditySha3(...val: Mixed[]): string;
    getUnitValue(unit: Unit): string;
    unitMap(): Units;
    testAddress(bloom: string, address: string): boolean;
    testTopic(bloom: string, topic: string): boolean;
    getSignatureParameters(signature: string): {r: string; s: string; v: number};
    stripHexPrefix(str: string): string;
  }

  class AbstractMethod {
    constructor(
        rpcMethod: string,
        parametersAmount: number,
        utils: Utils,
        formatters: formatters,
        moduleInstance: AbstractWeb3Module
    );

    utils: Utils;
    formatters: formatters;
    promiEvent: PromiEvent<any>;
    rpcMethod: string;
    parametersAmount: number;
    parameters: any[];

    getArguments(): any;
    setArguments(args: any[]): void;
    isHash(parameter: string): boolean;
    hasWallets(): boolean;
    callback(error: string | Error, response: any): void;
    beforeExecution(moduleInstance: AbstractWeb3Module): void;
    afterExecution(response: any): any;
    execute(): Promise<any> | PromiEvent<any> | string;
    clearSubscriptions(unsubscribeMethod: string): Promise<boolean | Error>;
  }

  class AbstractWeb3Module {
    constructor(
        provider: provider,
        options?: Web3ModuleOptions,
        methodFactory?: AbstractMethodFactory,
        net?: net.Socket | null
    );

    BatchRequest: new () => BatchRequest;
    defaultBlock: string | number;
    transactionBlockTimeout: number;
    transactionConfirmationBlocks: number;
    transactionPollingTimeout: number;
    defaultGasPrice: string;
    defaultGas: number;
    static readonly providers: Providers;
    defaultAccount: string | null;
    readonly currentProvider: Web3EthereumProvider | HttpProvider | IpcProvider | WebsocketProvider | CustomProvider;
    readonly givenProvider: any;

    setProvider(provider: provider, net?: net.Socket): boolean;
    isSameProvider(provider: provider): boolean;
    clearSubscriptions(subscriptionType: string): Promise<boolean>;
  }

  class AbstractMethodFactory {
    constructor(utils: Utils, formatters: formatters);

    methods: null | object;
    hasMethod: boolean;

    createMethod(name: string, moduleInstance: AbstractWeb3Module): AbstractMethod;
  }

  class Web3EthereumProvider extends AbstractSocketProvider {
    constructor(ethereumProvider: any);
  }

  interface Web3ModuleOptions {
    defaultAccount?: string;
    defaultBlock?: string | number;
    transactionBlockTimeout?: number;
    transactionConfirmationBlocks?: number;
    transactionPollingTimeout?: number;
    defaultGasPrice?: string;
    defaultGas?: number;
    transactionSigner?: TransactionSigner;
  }

  interface TransactionSigner {
    sign(transactionConfig: TransactionConfig): Promise<SignedTransaction>;
  }

  interface TransactionConfig {
    from?: string | number;
    to?: string;
    value?: number | string | BN;
    gas?: number | string;
    gasPrice?: number | string | BN;
    data?: string;
    nonce?: number;
    chainId?: number;
  }

  interface SignedTransaction {
    messageHash?: string;
    r: string;
    s: string;
    v: string;
    rawTransaction?: string;
    transactionHash?: string;
  }

  class BatchRequest {
    constructor(moduleInstance: AbstractWeb3Module);
    add(method: AbstractMethod): void;
    execute(): Promise<{methods: AbstractMethod[]; response: any[]} | Error[]>;
  }

  interface Providers {
    HttpProvider: new (host: string, options?: HttpProviderOptions) => HttpProvider;
    WebsocketProvider: new (host: string, options?: WebsocketProviderOptions) => WebsocketProvider;
    IpcProvider: new (path: string, net: any) => IpcProvider;
  }

  class HttpProvider {
    constructor(host: string, options?: HttpProviderOptions);
    host: string;
    connected: boolean;
    supportsSubscriptions(): boolean;
    send(method: string, parameters: any[]): Promise<any>;
    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]>;
    disconnect(): boolean;
  }

  interface HttpProviderOptions {
    host?: string;
    timeout?: number;
    headers?: HttpHeader[];
    withCredentials?: boolean;
  }

  interface HttpHeader {
    name: string;
    value: string;
  }

  class CustomProvider {
    constructor(injectedProvider: any);
    host: string;
    supportsSubscriptions(): boolean;
    send(method: string, parameters: any[]): Promise<any>;
    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]>;
  }

  class WebsocketProvider extends AbstractSocketProvider {
    constructor(host: string, options?: WebsocketProviderOptions);
    isConnecting(): boolean;
  }

  interface WebsocketProviderOptions {
    host?: string;
    timeout?: number;
    headers?: {};
    protocol?: string;
    clientConfig?: string;
  }

  class IpcProvider extends AbstractSocketProvider {
    constructor(path: string, net: net.Server);
  }

  class AbstractSocketProvider {
    constructor(connection: any, timeout?: number);

    host: string;
    connected: boolean;

    supportsSubscriptions(): boolean;

    registerEventListeners(): void;

    send(method: string, parameters: any[]): Promise<any>;

    sendBatch(methods: AbstractMethod[], moduleInstance: AbstractWeb3Module): Promise<any[]>;

    subscribe(subscribeMethod: string, subscriptionMethod: string, parameters: any[]): Promise<string>;

    unsubscribe(subscriptionId: string, unsubscribeMethod: string): Promise<boolean>;

    clearSubscriptions(unsubscribeMethod: string): Promise<boolean>;

    on(type: string, callback: () => void): void;

    removeListener(type: string, callback: () => void): void;

    removeAllListeners(type: string): void;

    reset(): void;

    reconnect(): void;

    disconnect(code: number, reason: string): void;
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

  interface AbiItem {
    anonymous?: boolean;
    constant?: boolean;
    inputs?: AbiInput[];
    name?: string;
    outputs?: AbiOutput[];
    payable?: boolean;
    stateMutability?: StateMutabilityType;
    type: AbiType;
  }

  interface AbiInput {
    name: string;
    type: string;
    indexed?: boolean;
  	components?: AbiInput[];
  }

  interface AbiOutput {
    name: string;
    type: string;
    components?: AbiOutput[];
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