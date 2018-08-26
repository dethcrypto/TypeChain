var prepare = require("mocha-prepare");

import { generateTypeChainWrappers } from "../../lib/typechain";
import { join } from "path";

/**
 * NOTE: this is done here only to easily count code coverage.
 * Normally you would run typechain in separate build step, before running your tests.
 */

prepare(async (done: any) => {
  await generateTypeChainWrappers({
    glob: "**/*.abi",
    force: true,
  });

  const outputPath = join(__dirname, "../../test-tmp/");
  await generateTypeChainWrappers({
    glob: "**/*.abi",
    force: true,
    outDir: outputPath,
  });
  done();
});
