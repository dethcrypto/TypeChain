import * as commandLineArgs from "command-line-args";
import { TTypechainTarget } from "..";

const DEFAULT_GLOB_PATTERN = "**/*.abi";

export interface IOptions {
  files: string;
  target: TTypechainTarget;
  outDir?: string;
}

const ALLOWED_TARGETS = "legacy";

export function parseArgs(): IOptions {
  const optionDefinitions = [
    { name: "glob", type: String, defaultOption: true },
    { name: "target", type: String },
    { name: "outDir", type: String },
  ];

  const rawOptions = commandLineArgs(optionDefinitions);

  if (ALLOWED_TARGETS.indexOf(rawOptions.target) === -1) {
    throw new Error(
      `target argument wrong or missing. Allowed: ${ALLOWED_TARGETS}, but provided: ${
        rawOptions.target
      }`,
    );
  }

  return {
    files: rawOptions.glob || DEFAULT_GLOB_PATTERN,
    outDir: rawOptions.outDir,
    target: rawOptions.target,
  };
}
