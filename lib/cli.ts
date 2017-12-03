#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { blue, red, green } from "chalk";
import { join, dirname, basename, parse, relative } from "path";
import { pathExistsSync } from "fs-extra";
import * as glob from "glob";

import { generateSource } from "./generateSource";

const cwd = process.cwd();

const defaultGlobPattern = "**/*.abi";

const globPattern = process.argv[2] || defaultGlobPattern;
const matches = glob.sync(globPattern, { ignore: "node_modules/**", absolute: true });

if (matches.length === 0) {
  console.log(red(`Found ${matches.length} ABIs.`));
  process.exit(0);
}

console.log(green(`Found ${matches.length} ABIs.`));
console.log("Generating typings...");

function filenameWithoutAnyExtensions(filePath: string): string {
  return filePath.slice(0, filePath.indexOf("."));
}

matches.forEach(absPath => {
  const relativeInputPath = relative(cwd, absPath);
  const parsedInputPath = parse(absPath);
  const outputPath = join(
    parsedInputPath.dir,
    filenameWithoutAnyExtensions(parsedInputPath.name) + ".ts"
  );
  const relativeOutputPath = relative(cwd, outputPath);

  console.log(blue(`${relativeInputPath} => ${relativeOutputPath}`));
  if (pathExistsSync(outputPath)) {
    console.log(red("File exists, skipping"));
    return;
  }

  const abiString = readFileSync(absPath).toString();
  const rawAbi = JSON.parse(abiString);

  const typescriptSourceFile = generateSource(rawAbi);
  writeFileSync(outputPath, typescriptSourceFile);
});
