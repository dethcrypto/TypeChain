import { TsGeneratorPlugin, TFileDesc, TContext, TOutput } from "ts-generator";
import _ = require("lodash");
import { compact } from "lodash";
import debug from "./utils/debug";
import { isAbsolute, join } from "path";

export interface ITypeChainCfg {
  target: string;
  outDir?: string;
}

/**
 * Proxies calls to real implementation that is selected based on target parameter.
 */
export class TypeChain extends TsGeneratorPlugin {
  name = "TypeChain";
  private realImpl: TsGeneratorPlugin;

  constructor(ctx: TContext<ITypeChainCfg>) {
    super(ctx);

    this.realImpl = this.findRealImpl(ctx);
  }

  private findRealImpl(ctx: TContext<ITypeChainCfg>): TsGeneratorPlugin {
    const target = ctx.rawConfig.target;
    if (!target) {
      throw new Error(`Please provide --target parameter!`);
    }

    const possiblePaths = [
      process.env.NODE_ENV === "test" && `../../typechain-target-${target}/lib/index`, // only for tests
      `typechain-target-${target}`, //external module
      ensureAbsPath(target), // path
    ];

    const module = _(possiblePaths)
      .compact()
      .map(tryRequire)
      .compact()
      .first();

    if (!module || !module.default) {
      throw new Error(
        `Couldnt find ${ctx.rawConfig.target}. Tried loading: ${compact(possiblePaths).join(
          ", ",
        )}.\nPerhaps you forgot to install typechain-target-${target}?`,
      );
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

function ensureAbsPath(path: string): string {
  if (isAbsolute(path)) {
    return path;
  }
  return join(process.cwd(), path);
}
