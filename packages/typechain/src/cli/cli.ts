#!/usr/bin/env node
import { parseArgs } from './parseArgs'
import { runTypeChain } from '../typechain/runTypeChain'
import { logger } from '../utils/logger'
import { Config } from '../typechain/types'
import { glob } from '../utils/glob'
import * as prettier from 'prettier'

async function main() {
  ;(global as any).IS_CLI = true
  const options = parseArgs()
  const cwd = process.cwd()

  const config: Config = {
    cwd,
    target: options.target,
    outDir: options.outDir,
    allFiles: glob(cwd, [options.files]),
    filesToProcess: glob(cwd, [options.files]),
    prettier,
  }

  const result = await runTypeChain(config)
  console.log(`Generated ${result.filesGenerated} typings.`)
}

main().catch((e) => {
  logger.error('Error occured: ', e.message)

  const stackTracesEnabled = process.argv.includes('--show-stack-traces')
  if (stackTracesEnabled) {
    logger.error('Stack trace: ', e.stack)
  } else {
    logger.error('Run with --show-stack-traces to see the full stacktrace')
  }
  process.exit(1)
})
