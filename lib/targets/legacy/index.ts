import { TsGeneratorPlugin, TFileDesc, TContext, getRelativeModulePath } from "ts-generator";
import { join, dirname } from "path";
import { codegen, getRuntime } from "./generation";
import { extractAbi } from "../../parser/abiParser";
import { getFilename } from "../shared";

export interface ITypechainCfg {
  outDir?: string;
}

export class TypechainLegacy extends TsGeneratorPlugin {
  name = "Typechain-legacy";

  private readonly outDirAbs?: string;
  private runtimePathAbs?: string;

  constructor(ctx: TContext<ITypechainCfg>) {
    super(ctx);

    const { cwd, rawConfig } = ctx;

    if (rawConfig.outDir) {
      this.outDirAbs = join(cwd, rawConfig.outDir);
      this.runtimePathAbs = buildOutputRuntimePath(this.outDirAbs);
    }
  }

  transformFile(file: TFileDesc): TFileDesc | void {
    const fileDirPath = dirname(file.path);
    if (!this.runtimePathAbs) {
      this.runtimePathAbs = buildOutputRuntimePath(fileDirPath);
    }

    const outDir = this.outDirAbs || fileDirPath;

    const fileName = getFilename(file.path);
    const outputFilePath = join(outDir, `${fileName}.ts`);
    const relativeRuntimePath = getRelativeModulePath(outputFilePath, this.runtimePathAbs);

    const abi = extractAbi(file.contents);
    if (abi.length === 0) {
      return;
    }

    const wrapperContents = codegen(abi, { fileName, relativeRuntimePath });

    return {
      path: outputFilePath,
      contents: wrapperContents,
    };
  }

  afterRun(): TFileDesc | void {
    if (this.runtimePathAbs) {
      return {
        path: this.runtimePathAbs,
        contents: getRuntime(),
      };
    }
  }
}

function buildOutputRuntimePath(dirPath: string): string {
  return join(dirPath, "typechain-runtime.ts");
}
