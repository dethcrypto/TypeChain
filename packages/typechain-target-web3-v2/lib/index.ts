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
  import { PromiEvent, TransactionConfig } from "web3-core";
  
  export type Callback<T> = (error: Error, result: T) => void;
  export interface TransactionObject<T> {
    arguments: any[];
    call(tx?: TransactionConfig): Promise<T>;
    send(tx?: TransactionConfig): PromiEvent<T>;
    estimateGas(tx?: TransactionConfig): Promise<number>;
    encodeABI(): string;
  }`,
      },
    ];
  }
}
