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
  } catch (e) {
    debug("Couldn't load: ", name)
  }
}
