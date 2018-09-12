const prepare = require("mocha-prepare");
import { removeSync } from "fs-extra";

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

    await generateLegacy(cwd, prettierCfg);
    await generateTruffle(cwd, prettierCfg);
    await generateWeb3_1(cwd, prettierCfg);

    done();
  })().catch(e => {
    // tslint:disable-next-line
    console.error(e);
    process.exit(1);
  });
});

async function generateLegacy(cwd: string, prettierCfg: any) {
  const outDir = "./targets/legacy/wrappers";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypechainCfg> = {
    files: "**/*.abi",
    target: "legacy",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new Typechain({ cwd, rawConfig }));
}

async function generateTruffle(cwd: string, prettierCfg: any) {
  const outDir = "./targets/truffle/@types/truffle-contracts";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypechainCfg> = {
    files: "targets/truffle/build/**/*.json",
    target: "truffle",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new Typechain({ cwd, rawConfig }));
}

async function generateWeb3_1(cwd: string, prettierCfg: any) {
  const outDir = "./targets/web3-1.0.0/types/web3-contracts";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypechainCfg> = {
    files: "**/*.abi",
    target: "web3-1.0.0",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new Typechain({ cwd, rawConfig }));
}
