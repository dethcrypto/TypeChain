import { posix } from 'path'

/**
 * Transforms all paths matching `ContractName.sol/ContractName.json`
 */
export function shortenFullJsonFilePath(path: string) {
  const parsed = posix.parse(path)

  const sourceFileName = `${parsed.name}.sol`
  if (parsed.dir.endsWith(sourceFileName)) {
    return parsed.dir.slice(0, -sourceFileName.length) + `${parsed.name}.json`
  }

  return path
}
