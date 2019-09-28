import { TsGeneratorPlugin, TFileDesc, TContext, TOutput } from "ts-generator";
import _ = require("lodash");
import { compact } from "lodash";
import debug from "./utils/debug";

export interface ITypechainCfg {
  target: string;
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

  private findRealImpl(ctx: TContext<ITypechainCfg>): TsGeneratorPlugin {
    const target = ctx.rawConfig.target;
    if (!target) {
      throw new Error(`Please provide --target parameter!`);
    }

    const possiblePaths = [
      process.env.NODE_ENV === "test" && `../../typechain-target-${target}/lib/index`, // only for tests
      `typechain-target-${target}`, //external module
      target, // absolute path
    ];

    const module = _(possiblePaths)
      .compact()
      .map(tryRequire)
      .compact()
      .first();

    if (!module) {
      throw new Error(`Couldnt find ${ctx.rawConfig.target}. Tried: ${compact(possiblePaths)}`);
    }

    return new module.default(ctx);
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

function tryRequire(path: string): any {
  try {
    return require(path);
  } catch (e) {
    debug(e);
  }
}
