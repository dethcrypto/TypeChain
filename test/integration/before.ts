const prepare = require("mocha-prepare");
import { readFileSync } from "fs";
import { removeSync } from "fs-extra";
import { join } from "path";
import { tsGenerator } from "ts-generator";
import { TPluginCfg } from "ts-generator/dist/parseConfigFile";

import { ITypeChainCfg, TypeChain } from "../../packages/core/lib/TypeChain";

/**
 * NOTE: this is done here only to easily count code coverage.
 * Normally you would run TypeChain in separate build step, before running your tests.
 */

prepare((done: any) => {
  (async () => {
    const cwd = __dirname;
    const prettierCfg = JSON.parse(readFileSync(join(__dirname, "../../.prettierrc"), "utf8"));

    process.env.NODE_ENV = "test";
    await generateTruffle(cwd, prettierCfg);
    await generateWeb3_v1(cwd, prettierCfg);
    await generateWeb3_v2(cwd, prettierCfg);
    await generateEthers(cwd, prettierCfg);

    done();
  })().catch(e => {
    // tslint:disable-next-line
    console.error(e);
    process.exit(1);
  });
});

async function generateTruffle(cwd: string, prettierCfg: any) {
  const outDir = "./targets/truffle/@types/truffle-contracts";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypeChainCfg> = {
    files: "targets/truffle/build/**/*.json",
    target: "truffle",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new TypeChain({ cwd, rawConfig }));
}

async function generateWeb3_v1(cwd: string, prettierCfg: any) {
  const outDir = "./targets/web3-v1/types/web3-v1-contracts";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypeChainCfg> = {
    files: "**/*.abi",
    target: "web3-v1",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new TypeChain({ cwd, rawConfig }));
}

async function generateWeb3_v2(cwd: string, prettierCfg: any) {
  const outDir = "./targets/web3-v2/types/web3-v2-contracts";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypeChainCfg> = {
    files: "**/*.abi",
    target: "web3-v2",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new TypeChain({ cwd, rawConfig }));
}

async function generateEthers(cwd: string, prettierCfg: any) {
  const outDir = "./targets/ethers/types/ethers-contracts";

  removeSync(join(__dirname, outDir));

  const rawConfig: TPluginCfg<ITypeChainCfg> = {
    files: "**/*.{abi,bin}",
    target: "ethers",
    outDir,
  };

  await tsGenerator({ cwd, prettier: prettierCfg }, new TypeChain({ cwd, rawConfig }));
}
