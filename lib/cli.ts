#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { blue, red, green } from "chalk";
import { join, dirname, basename, parse, relative } from "path";
import { pathExistsSync } from "fs-extra";
import * as glob from "glob";

import { generateSource } from "./generateSource";
import { parseArgs } from "./parseArgs";

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

  matches.forEach(p => processFile(p, options.force));
}

function processFile(absPath: string, forceOverwrite: boolean): void {
  const relativeInputPath = relative(cwd, absPath);
  const parsedInputPath = parse(absPath);
  const outputPath = join(
    parsedInputPath.dir,
    filenameWithoutAnyExtensions(parsedInputPath.name) + ".ts"
  );
  const relativeOutputPath = relative(cwd, outputPath);

  console.log(blue(`${relativeInputPath} => ${relativeOutputPath}`));
  if (pathExistsSync(outputPath) && !forceOverwrite) {
    console.log(red("File exists, skipping"));
    return;
  }

  const abiString = readFileSync(absPath).toString();
  const rawAbi = JSON.parse(abiString);

  const typescriptSourceFile = generateSource(rawAbi);
  writeFileSync(outputPath, typescriptSourceFile);
}

function filenameWithoutAnyExtensions(filePath: string): string {
  const endPosition = filePath.indexOf(".");
  return filePath.slice(0, endPosition !== -1 ? endPosition : filePath.length);
}

main();
