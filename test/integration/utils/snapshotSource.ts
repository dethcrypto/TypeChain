import { readFileSync } from "fs";

import * as snapshot from "snap-shot-it";

export function snapshotSource(path: string) {
  const source = readFileSync(path, "utf8");

  // first line of source contains ts-generator comment which can change in future (it has version inside) so we strip it entirely
  const sourceStable = source
    .split("\n")
    .slice(1)
    .join("\n");

  snapshot(sourceStable);
}
