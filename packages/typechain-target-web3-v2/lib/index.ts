import { TsGeneratorPlugin, TContext, TFileDesc } from "ts-generator";
import { join } from "path";
import { extractAbi, parse, getFilename } from "typechain";
import { codegen } from "./generation";

export interface IWeb3Cfg {
  outDir?: string;
}

const DEFAULT_OUT_PATH = "./types/web3-v2-contracts/";

export default class Web3V2 extends TsGeneratorPlugin {
  name = "Web3-v2";

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
  import { EventLog, PromiEvent, TransactionConfig } from "web3-core";
  import { EventOptions } from "web3-eth-contract";
  import { EventEmitter } from "events";
  
  export type Callback<T> = (error: Error, result: T) => void;
  export interface TransactionObject<T> {
    arguments: any[];
    call(tx?: TransactionConfig): Promise<T>;
    send(tx?: TransactionConfig): PromiEvent<T>;
    estimateGas(tx?: TransactionConfig): Promise<number>;
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
