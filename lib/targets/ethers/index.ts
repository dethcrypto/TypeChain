import { TsGeneratorPlugin, TContext, TFileDesc } from "ts-generator";
import { join } from "path";
import { extractAbi, parse, Contract, extractBytecode } from "../../parser/abiParser";
import { getFilename, getFileExtension } from "../shared";
import { codegenContractTypings, codegenContractFactory } from "./generation";
import { Dictionary } from "ts-essentials";

export interface IEthersCfg {
  outDir?: string;
}

const DEFAULT_OUT_PATH = "./types/ethers-contracts/";

export class Ethers extends TsGeneratorPlugin {
  name = "Ethers";

  private readonly outDirAbs: string;
  private readonly contractCache: Dictionary<{
    abi: any;
    contract: Contract;
  }> = {};
  private readonly bytecodeCache: Dictionary<string> = {};

  constructor(ctx: TContext<IEthersCfg>) {
    super(ctx);

    const { cwd, rawConfig } = ctx;

    this.outDirAbs = join(cwd, rawConfig.outDir || DEFAULT_OUT_PATH);
  }

  transformFile(file: TFileDesc): TFileDesc[] | void {
    const fileExt = getFileExtension(file.path);

    // For json files with both ABI and bytecode, both the contract typing and factory can be
    // generated at once. For split files (.abi and .bin) we don't know in which order they will
    // be transformed -- so we temporarily store whichever comes first, and generate the factory
    // only when both ABI and bytecode are present.

    // TODO we might want to add a configuration switch to control whether we want to generate the
    // factories, or just contract type declarations.

    if (fileExt === ".bin") {
      return this.transformBinFile(file);
    }

    return this.transformAbiOrFullJsonFile(file);
  }

  transformBinFile(file: TFileDesc): TFileDesc[] | void {
    const name = getFilename(file.path);
    const bytecode = extractBytecode(file.contents);

    if (!bytecode) {
      return;
    }

    if (this.contractCache[name]) {
      const { contract, abi } = this.contractCache[name];
      return [this.genContractFactoryFile(contract, abi, bytecode)];
    } else {
      this.bytecodeCache[name] = bytecode;
    }
  }

  transformAbiOrFullJsonFile(file: TFileDesc): TFileDesc[] | void {
    const name = getFilename(file.path);
    const abi = extractAbi(file.contents);

    if (abi.length === 0) {
      return;
    }

    const contract = parse(abi, name);
    const bytecode = extractBytecode(file.contents) || this.bytecodeCache[name];

    if (bytecode) {
      return [
        this.genContractTypingsFile(contract),
        this.genContractFactoryFile(contract, abi, bytecode),
      ];
    } else {
      this.contractCache[name] = { abi, contract };
      return [this.genContractTypingsFile(contract)];
    }
  }

  genContractTypingsFile(contract: Contract): TFileDesc {
    return {
      path: join(this.outDirAbs, `${contract.name}.d.ts`),
      contents: codegenContractTypings(contract),
    };
  }

  genContractFactoryFile(contract: Contract, abi: any, bytecode: string) {
    return {
      path: join(this.outDirAbs, `${contract.name}Factory.ts`),
      contents: codegenContractFactory(contract, abi, bytecode),
    };
  }

  afterRun(): TFileDesc[] {
    return [
      {
        path: join(this.outDirAbs, "index.d.ts"),
        contents: `
        import { BigNumberish, EventDescription, FunctionDescription } from "ethers/utils";

        export class TransactionOverrides {
          nonce?: BigNumberish | Promise<BigNumberish>;
          gasLimit?: BigNumberish | Promise<BigNumberish>;
          gasPrice?: BigNumberish | Promise<BigNumberish>;
          value?: BigNumberish | Promise<BigNumberish>;
          chainId?: number | Promise<number>;
        }

        export interface TypedEventDescription<T extends Pick<EventDescription, 'encodeTopics'>>
        extends EventDescription {
          encodeTopics: T['encodeTopics'];
        }

        export interface TypedFunctionDescription<T extends Pick<FunctionDescription, 'encode'>>
        extends FunctionDescription {
          encode: T['encode'];
        }
        `,
      },
    ];
  }
}
