import { copySync } from "fs-extra";
import { join } from "path";

export function copyRuntime(path: string): void {
  copySync(join(__dirname, "./typechain-runtime.ts"), path)
}