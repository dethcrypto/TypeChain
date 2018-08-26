#!/usr/bin/env node
import { parseArgs } from "./parseArgs";
import { generateTypeChainWrappers } from "./typechain";
import { logger } from "./logger";

async function main() {
  (global as any).IS_CLI = true;
  const options = parseArgs();

  await generateTypeChainWrappers(options);
}

main().catch(e => {
  // tslint:disable-next-line
  logger.error("Error occured: ", e.message);
  process.exit(1);
});
