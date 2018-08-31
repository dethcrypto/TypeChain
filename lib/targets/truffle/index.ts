// import { RawAbiDefinition, Contract } from "../../abiParser";
// import { IContext } from "../../generateSource";
// import { TsGeneratorPlugin, TContext, TFileDesc } from "ts-generator";
// import { join } from "path";
// import { extractAbi, parse } from "../../parser/abiParser";
// import { getFilename } from "../shared";

// export function codeGenForContract(
//   abi: Array<RawAbiDefinition>,
//   input: Contract,
//   context: IContext,
// ) {
//   return `

// `;
// }

// export interface ITruffleCfg {
//   outDir?: string;
// }

// export interface IFragment {
//   name: string;
//   contract: Contract;
// }

// const DEFAULT_OUT_PATH = "./types/truffle-contracts/index.d.ts";

// export class Truffle extends TsGeneratorPlugin {
//   name = "Truffle";

//   private readonly outDirAbs: string;
//   private fragments: IFragment[] = [];

//   constructor(ctx: TContext<ITruffleCfg>) {
//     super(ctx);

//     const { cwd, rawConfig } = ctx;

//     this.outDirAbs = join(cwd, rawConfig.outDir || DEFAULT_OUT_PATH);
//   }

//   transformFile(file: TFileDesc): TFileDesc | void {
//     const abi = extractAbi(file.contents);
//     const isEmptyAbi = abi.length === 0;
//     if (isEmptyAbi) {
//       return;
//     }

//     const contract = parse(abi);

//     const name = getFilename(file.path);

//     this.fragments.push({ name, contract });
//   }

//   afterRun(): TFileDesc | void {}
// }
