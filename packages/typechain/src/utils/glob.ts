import { sync as globSync } from 'glob'
import { flatten, uniq } from 'lodash'

export function glob(cwd: string, patternsOrFiles: string[]): string[] {
  const matches = patternsOrFiles.map((p) => globSync(p, { ignore: 'node_modules/**', absolute: true, cwd }))

  return uniq(flatten(matches))
}
