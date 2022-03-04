import { camelCase, groupBy, mapValues, uniq } from 'lodash'
import { posix } from 'path'
import { FileDescription, normalizeName } from 'typechain'

export function lowestCommonPath(paths: string[]) {
  const pathParts = paths.map((path) => path.split(/[\\/]/))
  const commonParts = pathParts[0].filter((part, index) => pathParts.every((parts) => parts[index] === part))
  return commonParts.join('/')
}

export function generateBarrelFiles(paths: string[], { typeOnly }: { typeOnly: boolean }): FileDescription[] {
  const fileReexports: Record<string, string[] | undefined> = filenamesByDir(paths)

  const directoryReexports: Record<string, string[] | undefined> = filenamesByDir(
    Object.keys(fileReexports).filter((path) => path.includes('/')),
  )

  let barrelPaths = uniq(Object.keys(directoryReexports).concat(Object.keys(fileReexports)))
  const newPaths: string[] = []

  for (const directory of barrelPaths) {
    if (!directory) continue

    const path = directory.split('/')
    while (path.length) {
      const dir = path.slice(0, -1).join('/')
      const name = path[path.length - 1]

      if (!(dir in directoryReexports)) {
        directoryReexports[dir] = [name]
        newPaths.push(dir)
      } else if (!directoryReexports[dir]!.find((x) => x === name)) {
        directoryReexports[dir]!.push(name)
      }

      path.pop()
    }
  }

  barrelPaths = barrelPaths.concat(newPaths)

  return barrelPaths.map((path) => {
    const nestedDirs = (directoryReexports[path] || []).sort()

    const namespacesExports = nestedDirs
      .map((p) => {
        const exportKeyword = typeOnly ? 'export type' : 'export'
        const namespaceIdentifier = camelCase(p)

        return `${exportKeyword} * as ${namespaceIdentifier} from './${p}';`
      })
      .join('\n')

    const contracts = (fileReexports[path] || []).sort()
    const namedExports = contracts
      .map((p) => {
        const exportKeyword = typeOnly ? 'export type' : 'export'

        return `${exportKeyword} { ${normalizeName(p)} } from './${p}';`
      })
      .join('\n')

    return {
      path: posix.join(path, 'index.ts'),
      contents: (namespacesExports + '\n' + namedExports).trim(),
    }
  })
}

function filenamesByDir(paths: string[]): Record<string, string[] | undefined> {
  return mapValues(
    groupBy(paths.map(posix.parse), (p) => p.dir),
    (ps) => ps.map((p) => p.name),
  )
}
