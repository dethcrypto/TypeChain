#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { blue, red, green } from "chalk";
import { join, dirname, basename, parse } from "path";
import * as glob from "glob";
import { generateSource } from "./generateSource";

const defaultPattern = "**/*.abi";

const matches = glob.sync(defaultPattern, { ignore: "node_modules/**", absolute: true });

const color = matches.length > 0 ? green : red;

console.log(color(`Found ${matches.length} ABIs.`));
console.log("Generating typings...");

// @todo add possibility to overwrite default and ignore patterns
matches.forEach(absPath => {
  console.log(blue(absPath));
  const abiString = readFileSync(absPath).toString();
  const rawAbi = JSON.parse(abiString);

  const typescriptSourceFile = generateSource(rawAbi);
  const parsedPath = parse(absPath);
  writeFileSync(join(parsedPath.dir, parsedPath.name + ".ts"), typescriptSourceFile);
});
