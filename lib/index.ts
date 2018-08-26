import { TPlugin, TFileDesc, TContext } from "ts-generator";

// glob: string;
//   force: boolean;
//   outDir?: string;

interface ITypechainCfg {
  outDir?: string;
}

export class Typechain implements TPlugin {
  constructor(ctx: TContext) {
    const c = ctx.config as any as ITypechainCfg;

    
  }

  init(): void {
    throw new Error("Method not implemented.");
  }

  transformFile(file: TFileDesc): TFileDesc | TFileDesc[] | Promise<TFileDesc | TFileDesc[]> {
    throw new Error("Method not implemented.");
  }
}
