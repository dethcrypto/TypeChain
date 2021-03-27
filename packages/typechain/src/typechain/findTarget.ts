import _, { compact } from 'lodash'
import { ensureAbsPath } from '../utils/files'
import { tryRequire } from '../utils/modules'
import { debug } from '../utils/debug'
import { Config, TypeChainTarget } from './types'

export function findTarget(config: Config): TypeChainTarget {
  const target = config.target
  if (!target) {
    throw new Error(`Please provide --target parameter!`)
  }

  const possiblePaths = [
    process.env.NODE_ENV === 'test' && `../../typechain-target-${target}/lib/index`, // only for tests
    `@typechain/${target}`, //external module
    `typechain-target-${target}`, //external module
    ensureAbsPath(target), // path
  ]

  const moduleInfo = _(possiblePaths).compact().map(tryRequire).compact().first()

  if (!moduleInfo || !moduleInfo.module.default) {
    throw new Error(
      `Couldn't find ${config.target}. Tried loading: ${compact(possiblePaths).join(
        ', ',
      )}.\nPerhaps you forgot to install @typechain/${target}?`,
    )
  }

  debug('Plugin found at', moduleInfo.path)

  return new moduleInfo.module.default(config)
}
