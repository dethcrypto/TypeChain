import { readFileSync, writeFileSync } from "fs";
import { join, dirname, parse, relative } from "path";
import { pathExistsSync } from "fs-extra";
import * as glob from "glob";
import * as prettier from "prettier";

import { generateSource } from "./generateSource";
import { copyRuntime } from "./copyRuntime";
import { extractAbi } from "./abiParser";
import { IOptions } from "./parseArgs";
import { logger } from "./logger";

import chalk from "chalk";
const { blue, red, green, yellow } = chalk;

export async function generateTypeChainWrappers(options: IOptions): Promise<void> {
  if (!options.cwd) {
    options.cwd = process.cwd();
  }
  const matches = glob.sync(options.glob, { ignore: "node_modules/**", absolute: true });

  if (matches.length === 0) {
    logger.warn(`Found ${matches.length} ABIs.`);
    process.exit(0);
  }

  logger.log(green(`Found ${matches.length} ABIs.`));

  const prettierConfig = await prettier.resolveConfig(dirname(matches[0]));
  if (prettierConfig) {
    logger.log("Found prettier config file");
  }

  logger.log("Generating typings...");

  // copy runtime in directory of first typing (@todo it should be customizable)
  const runtimeFilename = "typechain-runtime.ts";
  const runtimePath = join(options.outDir || dirname(matches[0]), runtimeFilename);
  copyRuntime(runtimePath);
  logger.log(blue(`${runtimeFilename} => ${runtimePath}`));

  // generate wrappers
  matches.forEach(p =>
    processFile(
      options,
      p,
      options.force,
      runtimePath,
      { ...(prettierConfig || {}), parser: "typescript" },
      options.outDir,
    ),
  );
}

function processFile(
  options: IOptions,
  absPath: string,
  forceOverwrite: boolean,
  runtimeAbsPath: string,
  prettierConfig: prettier.Options,
  fixedOutputDir?: string,
): void {
  const relativeInputPath = relative(options.cwd!, absPath);
  const parsedInputPath = parse(absPath);
  const filenameWithoutAnyExtensions = getFilenameWithoutAnyExtensions(parsedInputPath.name);
  const outputDir = fixedOutputDir || parsedInputPath.dir;
  const outputPath = join(outputDir, filenameWithoutAnyExtensions + ".ts");
  const relativeOutputPath = relative(options.cwd!, outputPath);

  const runtimeRelativePath = getRelativeModulePath(outputDir, runtimeAbsPath);
  logger.log(blue(`${relativeInputPath} => ${relativeOutputPath}`));
  if (pathExistsSync(outputPath) && !forceOverwrite) {
    logger.log(red("File exists, skipping"));
    return;
  }

  const abiString = readFileSync(absPath).toString();
  const rawAbi = extractAbi(abiString);

  if (rawAbi.length === 0) {
    logger.log(yellow("ABI is empty, skipping"));
    return;
  }

  const typescriptSourceFile = generateSource(rawAbi, {
    fileName: filenameWithoutAnyExtensions,
    relativeRuntimePath: runtimeRelativePath,
  });
  writeFileSync(outputPath, prettier.format(typescriptSourceFile, prettierConfig));
}

function getFilenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

function getRelativeModulePath(from: string, to: string): string {
  return ("./" + relative(from, to)).replace(".ts", ""); // @note: this is probably not the best way to find relative path for modules
}
