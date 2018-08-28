import { generateSource, IContext } from "./generateSource";
import { copyRuntime as copyRuntimeLocal } from "./copyRuntime";

import { RawAbiDefinition } from "./abiParser";

export function abiToWrapper(abi: Array<RawAbiDefinition>, ctx: IContext): string {
  return generateSource(abi, ctx);
}

export function copyRuntime(filePath: string): void {
  copyRuntimeLocal(filePath);
}
