import { readFileSync } from "fs";
import { join } from "path";

export function getRuntime(): string {
  const runtimePath = join(__dirname, "./templates/typechain/runtime/typechain-runtime.ts");
  return readFileSync(runtimePath, "utf8");
}
