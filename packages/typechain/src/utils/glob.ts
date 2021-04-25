import { readFileSync } from 'fs'
import { sync as globSync } from 'glob'
import { flatten, uniq } from 'lodash'
import { extractAbi } from '..'

/**
 * Processes a list of files or glob patterns.
 * Makes sure to skip empty ABIs.
 */
export function glob(cwd: string, patternsOrFiles: string[]): string[] {
  const matches = patternsOrFiles.map((p) => globSync(p, { ignore: 'node_modules/**', absolute: true, cwd }))

  const paths = uniq(flatten(matches))

  const notEmptyAbis = paths
    .map((p) => ({ path: p, contents: readFileSync(p, 'utf-8') }))
    .filter((fd) => extractAbi(fd.contents).length !== 0)

  return notEmptyAbis.map((p) => p.path)
}
