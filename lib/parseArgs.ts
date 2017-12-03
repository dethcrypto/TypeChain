import * as commandLineArgs from "command-line-args";

const DEFAULT_GLOB_PATTERN = "**/*.abi";

export interface IOptions {
  glob: string;
  force: boolean;
}

export function parseArgs(): IOptions {
  const optionDefinitions = [
    { name: "force", alias: "f", type: Boolean },
    { name: "glob", type: String, defaultOption: true },
  ];

  const rawOptions = commandLineArgs(optionDefinitions);

  console.log(rawOptions);

  return {
    force: !!rawOptions.force,
    glob: rawOptions.glob || DEFAULT_GLOB_PATTERN,
  };
}