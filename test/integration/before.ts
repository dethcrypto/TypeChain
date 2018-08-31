var prepare = require("mocha-prepare");

import { tsGenerator } from "ts-generator";
import { join } from "path";
import { Typechain, ITypechainCfg } from "../../lib";
import { TPluginCfg } from "ts-generator/dist/parseConfigFile";
import { readFileSync } from "fs";

/**
 * NOTE: this is done here only to easily count code coverage.
 * Normally you would run typechain in separate build step, before running your tests.
 */

prepare((done: any) => {
  (async () => {
    const cwd = __dirname;
    const prettierCfg = JSON.parse(readFileSync(join(__dirname, "../../.prettierrc"), "utf8"));
    const cfg: TPluginCfg<ITypechainCfg> = {
      files: "**/*.abi",
      target: "legacy",
      outDir: "./targets/legacy/wrappers",
    };

    await tsGenerator({ cwd, prettier: prettierCfg }, new Typechain({ cwd, rawConfig: cfg }));

    done();
  })().catch(e => {
    // tslint:disable-next-line
    console.error(e);
    process.exit(1);
  });
});
