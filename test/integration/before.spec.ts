var prepare = require("mocha-prepare");

import { generateTypeChainWrappers } from "../../lib/generateTypeChainWrappers";
import { join } from "path";

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
