import { debug } from './debug'

export function tryRequire(name: string): { module: any; name: string; path: string } | undefined {
  try {
    const module = {
      module: require(name),
      name,
      path: require.resolve(name),
    }
    debug('Load successfully: ', name)
    return module
  } catch (err) {
    if (err instanceof Error && err.message.startsWith(`Cannot find module '${name}'`)) {
      // this error is expected
    } else {
      throw err
    }
    debug("Couldn't load: ", name)
  }
}
