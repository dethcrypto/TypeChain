import { TsGeneratorPlugin, TContext, TFileDesc } from "ts-generator";
import { join } from "path";
import { extractAbi, parse } from "../../parser/abiParser";
import { getFilename } from "../shared";
import { codegen } from "./generation";

export interface IWeb3Cfg {
  outDir?: string;
}

const DEFAULT_OUT_PATH = "./types/web3-contracts/";

export class Web3 extends TsGeneratorPlugin {
  name = "Web3";

  private readonly outDirAbs: string;

  constructor(ctx: TContext<IWeb3Cfg>) {
    super(ctx);

    const { cwd, rawConfig } = ctx;

    this.outDirAbs = join(cwd, rawConfig.outDir || DEFAULT_OUT_PATH);
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
  import { EventLog } from "web3-core";
  import BN from "bn.js";
  import { EstimateGasOptions, EventOptions } from "web3-eth-contract";
  import { EventEmitter } from "events";
  // @ts-ignore
  import PromiEvent from "web3-core-promievent";
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
    on(event: 'data' | 'changed', listener: (event: ContractEventLog<T>) => void): this;
    on(event: 'error', listener: (error: Error) => void): this;
  }
  export type ContractEvent<T> = (
    options?: EventOptions,
    cb?: Callback<ContractEventLog<T>>
  ) => ContractEventEmitter<T>;`,
      },
    ];
  }
}
