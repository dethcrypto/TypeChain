#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { blue, red, green } from "chalk";
import { join, dirname, basename, parse, relative } from "path";
import { pathExistsSync } from "fs-extra";
import * as glob from "glob";

import { generateSource } from "./generateSource";
import { parseArgs } from "./parseArgs";
import { copyRuntime } from "./runtime/copyRuntime";

const cwd = process.cwd();

function main() {
  const options = parseArgs();

  const matches = glob.sync(options.glob, { ignore: "node_modules/**", absolute: true });

  if (matches.length === 0) {
    console.log(red(`Found ${matches.length} ABIs.`));
    process.exit(0);
  }

  console.log(green(`Found ${matches.length} ABIs.`));
  console.log("Generating typings...");

  // copy runtime in directory of first typing (@todo it should be customizable)
  const runtimeFilename = "typechain-runtime.ts";
  const runtimePath = join(dirname(matches[0]), runtimeFilename);
  copyRuntime(runtimePath);
  console.log(blue(`${runtimeFilename} => ${runtimePath}`));

  // generate wrappers
  matches.forEach(p => processFile(p, options.force, runtimePath));
}

function processFile(absPath: string, forceOverwrite: boolean, runtimeAbsPath: string): void {
  const relativeInputPath = relative(cwd, absPath);
  const parsedInputPath = parse(absPath);
  const filenameWithoutAnyExtensions = getFilenameWithoutAnyExtensions(parsedInputPath.name);
  const outputPath = join(parsedInputPath.dir, filenameWithoutAnyExtensions + ".ts");
  const relativeOutputPath = relative(cwd, outputPath);
  
  const runtimeRelativePath = getRelativeModulePath(parsedInputPath.dir, runtimeAbsPath);
  console.log(blue(`${relativeInputPath} => ${relativeOutputPath}`));
  if (pathExistsSync(outputPath) && !forceOverwrite) {
    console.log(red("File exists, skipping"));
    return;
  }

  const abiString = readFileSync(absPath).toString();
  const rawAbi = JSON.parse(abiString);

  const typescriptSourceFile = generateSource(rawAbi, { fileName: filenameWithoutAnyExtensions, relativeRuntimePath: runtimeRelativePath });
  writeFileSync(outputPath, typescriptSourceFile);
}

function getFilenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

function getRelativeModulePath(from: string, to: string): string {
  return ("./" + relative(from, to)).replace(".ts", ""); // @note: this is probably not the best way to find relative path for modules 
}

main();
