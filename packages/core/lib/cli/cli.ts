#!/usr/bin/env node
import { tsGenerator } from "ts-generator";

import { parseArgs } from "./parseArgs";
import { TypeChain } from "../TypeChain";
import { logger } from "../utils/logger";

async function main() {
  (global as any).IS_CLI = true;
  const options = parseArgs();
  const cwd = process.cwd();

  await tsGenerator({ cwd, loggingLvl: "info" }, new TypeChain({ cwd, rawConfig: options }));
}

main().catch(e => {
  // tslint:disable-next-line
  logger.error("Error occured: ", e.message);
  process.exit(1);
});
