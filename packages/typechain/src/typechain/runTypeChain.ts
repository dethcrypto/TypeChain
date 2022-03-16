import * as fs from 'fs'
import { sync as mkdirp } from 'mkdirp'
import { relative } from 'path'
import * as prettier from 'prettier'

import { debug } from '../utils/debug'
import { findTarget } from './findTarget'
import { loadFileDescriptions, processOutput, skipEmptyAbis } from './io'
import { CodegenConfig, Config, PublicConfig, Services } from './types'

interface Result {
  filesGenerated: number
}

const DEFAULT_FLAGS: CodegenConfig = {
  alwaysGenerateOverloads: false,
  discriminateTypes: false,
  tsNocheck: false,
  environment: undefined,
}

export async function runTypeChain(publicConfig: PublicConfig): Promise<Result> {
  const _config: Config = {
    flags: DEFAULT_FLAGS,
    ...publicConfig,
  }
  // skip empty paths
  const config: Config = {
    ..._config,
    allFiles: skipEmptyAbis(_config.allFiles),
    filesToProcess: skipEmptyAbis(_config.filesToProcess),
  }
  const services: Services = {
    fs,
    prettier,
    mkdirp,
  }
  let filesGenerated = 0

  const target = findTarget(config)

  const fileDescriptions = loadFileDescriptions(services, config.filesToProcess)

  debug('Executing beforeRun()')
  filesGenerated += processOutput(services, config, await target.beforeRun())

  debug('Executing beforeRun()')
  for (const fd of fileDescriptions) {
    debug(`Processing ${relative(config.cwd, fd.path)}`)

    filesGenerated += processOutput(services, config, await target.transformFile(fd))
  }

  debug('Running afterRun()')
  filesGenerated += processOutput(services, config, await target.afterRun())

  return {
    filesGenerated,
  }
}
