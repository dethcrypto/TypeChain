#!/usr/bin/env node
import { readFileSync, writeFileSync } from "fs";
import { blue, red, green } from "chalk";
import { join } from "path";
import * as glob from "glob";
import { generateTypings } from "./generateTypings";

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

  const typings = generateTypings(rawAbi);
  writeFileSync(absPath + ".d.ts", typings);
});
