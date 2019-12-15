import { TsGeneratorPlugin, TContext, TFileDesc } from "ts-generator";
import { join, resolve } from "path";
import { extractAbi, parse, getFilename } from "typechain";
import { codegen } from "./generation";

export interface IWeb3Cfg {
  outDir?: string;
}

const DEFAULT_OUT_PATH = "./types/web3-v1-contracts/";

export default class Web3V1 extends TsGeneratorPlugin {
  name = "Web3-v1";

  private readonly outDirAbs: string;

  constructor(ctx: TContext<IWeb3Cfg>) {
    super(ctx);

    const { cwd, rawConfig } = ctx;

    this.outDirAbs = resolve(cwd, rawConfig.outDir || DEFAULT_OUT_PATH);
  }

  transformFile(file: TFileDesc): TFileDesc | void {
    const abi = extractAbi(file.contents);
    const isEmptyAbi = abi.length === 0;
    if (isEmptyAbi) {
      return;
    }

    const name = getFilename(file.path);

    const contract = parse(abi, name);

    return {
      path: join(this.outDirAbs, `${name}.d.ts`),
      contents: codegen(contract),
    };
  }

  afterRun(): TFileDesc[] {
    return [
      {
        path: join(this.outDirAbs, "types.d.ts"),
        contents: `
  import BN from "bn.js";
  import { EventLog } from "web3-core/types";
  import { EventEmitter } from "events";
  // @ts-ignore
  import PromiEvent from "web3/promiEvent";

  interface EstimateGasOptions {
    from?: string;
    gas?: number;
    value?: number | string | BN;
  }

  interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
  }

  export type Callback<T> = (error: Error, result: T) => void;
  export interface TransactionObject<T> {
    arguments: any[];
    call(options?: EstimateGasOptions): Promise<T>;
    send(options?: EstimateGasOptions): PromiEvent<T>;
    estimateGas(options?: EstimateGasOptions): Promise<number>;
    encodeABI(): string;
  }
  export interface ContractEventLog<T> extends EventLog {
    returnValues: T;
  }
  export interface ContractEventEmitter<T> extends EventEmitter {
    on(event: 'connected', listener: (subscriptionId: string) => void): this;
    on(event: "data" | "changed", listener: (event: ContractEventLog<T>) => void): this;
    on(event: "error", listener: (error: Error) => void): this;
  }
  export type ContractEvent<T> = (
    options?: EventOptions,
    cb?: Callback<ContractEventLog<T>>,
  ) => ContractEventEmitter<T>;

  export interface Tx {
    nonce?: string | number;
    chainId?: string | number;
    from?: string;
    to?: string;
    data?: string;
    value?: string | number;
    gas?: string | number;
    gasPrice?: string | number;
  }

  export interface TransactionObject<T> {
    arguments: any[];
    call(tx?: Tx): Promise<T>;
    send(tx?: Tx): PromiEvent<T>;
    estimateGas(tx?: Tx): Promise<number>;
    encodeABI(): string;
  }

  export type BlockType = "latest" | "pending" | "genesis" | number;`,
      },
    ];
  }
}
