import { relative } from 'path'

import { debug } from '../utils/debug'
import { detectInputsRoot } from '../utils/files'
import { findTarget } from './findTarget'
import { loadFileDescriptions, processOutput, skipEmptyAbis } from './io'
import { CodegenConfig, Config, PublicConfig } from './types'

interface Result {
  filesGenerated: number
}

export const DEFAULT_FLAGS: CodegenConfig = {
  alwaysGenerateOverloads: false,
  discriminateTypes: false,
  tsNocheck: false,
  environment: undefined,
}

export async function runTypeChain(publicConfig: PublicConfig): Promise<Result> {
  const allFiles = await skipEmptyAbis(publicConfig.allFiles)
  if (allFiles.length === 0) {
    return {
      filesGenerated: 0,
    }
  }

  // skip empty paths
  const config: Config = {
    flags: DEFAULT_FLAGS,
    inputDir: detectInputsRoot(allFiles),
    ...publicConfig,
    allFiles,
    filesToProcess: await skipEmptyAbis(publicConfig.filesToProcess),
  }
  let filesGenerated = 0

  const target = findTarget(config)

  const fileDescriptions = await loadFileDescriptions(config.filesToProcess)

  debug('Executing beforeRun()')
  filesGenerated += await processOutput(config, await target.beforeRun())

  debug('Executing beforeRun()')
  for (const fd of fileDescriptions) {
    debug(`Processing ${relative(config.cwd, fd.path)}`)

    filesGenerated += await processOutput(config, await target.transformFile(fd))
  }

  debug('Running afterRun()')
  filesGenerated += await processOutput(config, await target.afterRun())

  return {
    filesGenerated,
  }
}
