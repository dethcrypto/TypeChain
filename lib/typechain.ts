
import { generateSource, IContext } from "./generateSource";
import { copyRuntime as copyRuntimeLocal } from "./copyRuntime";

import chalk from "chalk";
const { blue, red, yellow } = chalk;

export function abiToWrapper(abi: object, ctx: IContext): string {
  return generateSource(abi as any, ctx);
}

export function copyRuntime(path: string): void {
  copyRuntimeLocal(path);
}

// function processFile(
//   options: IOptions,
//   absPath: string,
//   forceOverwrite: boolean,
//   runtimeAbsPath: string,
//   prettierConfig: prettier.Options,
//   fixedOutputDir?: string,
// ): void {
//   const relativeInputPath = relative(options.cwd!, absPath);
//   const parsedInputPath = parse(absPath);
//   const filenameWithoutAnyExtensions = getFilenameWithoutAnyExtensions(parsedInputPath.name);
//   const outputDir = fixedOutputDir || parsedInputPath.dir;
//   const outputPath = join(outputDir, filenameWithoutAnyExtensions + ".ts");
//   const relativeOutputPath = relative(options.cwd!, outputPath);

//   const runtimeRelativePath = getRelativeModulePath(outputDir, runtimeAbsPath);
//   logger.log(blue(`${relativeInputPath} => ${relativeOutputPath}`));
//   if (pathExistsSync(outputPath) && !forceOverwrite) {
//     logger.log(red("File exists, skipping"));
//     return;
//   }

//   const abiString = readFileSync(absPath).toString();
//   const rawAbi = extractAbi(abiString);

//   if (rawAbi.length === 0) {
//     logger.log(yellow("ABI is empty, skipping"));
//     return;
//   }

//   const typescriptSourceFile = abiToWrapper(rawAbi, {
//     fileName: filenameWithoutAnyExtensions,
//     relativeRuntimePath: runtimeRelativePath,
//   });

//   writeFileSync(outputPath, prettier.format(typescriptSourceFile, prettierConfig));
// }