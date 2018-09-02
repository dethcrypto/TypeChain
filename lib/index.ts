import { TsGeneratorPlugin, TFileDesc, TContext, TOutput } from "ts-generator";
import { TypechainLegacy } from "./targets/legacy";
import { Truffle } from "./targets/truffle";

export type TTypechainTarget = "truffle" | "legacy";

export interface ITypechainCfg {
  target: TTypechainTarget;
  outDir?: string;
}

/**
 * Proxies calls to real implementation that is selected based on target parameter.
 */
export class Typechain extends TsGeneratorPlugin {
  name = "Typechain";
  private realImpl: TsGeneratorPlugin;

  constructor(ctx: TContext<ITypechainCfg>) {
    super(ctx);

    this.realImpl = this.findRealImpl(ctx);
  }

  private findRealImpl(ctx: TContext<ITypechainCfg>) {
    switch (this.ctx.rawConfig.target) {
      case "legacy":
        return new TypechainLegacy(ctx);
      case "truffle":
        return new Truffle(ctx);
      default:
        throw new Error(`Unsupported target ${this.ctx.rawConfig.target}!`);
    }
  }

  beforeRun(): TOutput | Promise<TOutput> {
    return this.realImpl.beforeRun();
  }

  transformFile(file: TFileDesc): TOutput | Promise<TOutput> {
    return this.realImpl.transformFile(file);
  }

  afterRun(): TOutput | Promise<TOutput> {
    return this.realImpl.afterRun();
  }
}
