import { generateSource, IContext } from "./generateSource";

import { RawAbiDefinition } from "./abiParser";

export { getRuntime } from "./getRuntime";

export function abiToWrapper(abi: Array<RawAbiDefinition>, ctx: IContext): string {
  return generateSource(abi, ctx);
}
