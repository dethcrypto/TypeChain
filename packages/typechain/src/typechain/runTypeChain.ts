import _ = require('lodash')
import { debug } from '../utils/debug'
import { relative } from 'path'
import { Config, Services } from './types'
import { findTarget } from './findTarget'
import { loadFileDescriptions, processOutput } from './io'

import * as fs from 'fs'
import * as prettier from 'prettier'
import { sync as mkdirp } from 'mkdirp'

interface Result {
  filesGenerated: number
}

export async function runTypeChain(config: Config): Promise<Result> {
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
