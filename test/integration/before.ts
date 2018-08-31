var prepare = require("mocha-prepare");

import { tsGenerator } from "ts-generator";
import { join } from "path";
import { Typechain, ITypechainCfg } from "../../lib";
import { TPluginCfg } from "ts-generator/dist/parseConfigFile";

/**
 * NOTE: this is done here only to easily count code coverage.
 * Normally you would run typechain in separate build step, before running your tests.
 */

prepare((done: any) => {
  (async () => {
    const cwd = join(__dirname, "../../");
    const cfg: TPluginCfg<ITypechainCfg> = {
      files: "**/*.abi",
      target: "legacy",
    };

    await tsGenerator({ cwd }, new Typechain({ cwd, rawConfig: cfg }));

    const outputPath = "./test-tmp/";
    await tsGenerator({ cwd }, new Typechain({ cwd, rawConfig: { ...cfg, outDir: outputPath } }));

    done();
  })().catch(e => {
    // tslint:disable-next-line
    console.error(e);
    process.exit(1);
  });
});
