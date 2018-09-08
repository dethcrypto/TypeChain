import { readFileSync } from "fs";

import * as snapshot from "snap-shot-it";

export function snapshotSource(path: string) {
  const source = readFileSync(path, "utf8");

  snapshot(source);
}
