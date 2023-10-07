import { camelCase } from 'lodash'

/**
 * Converts valid directory name to valid variable name. Example: 0directory-name becomes _0DirectoryName
 */
export function normalizeDirName(rawName: string): string {
  const transformations: ((s: string) => string)[] = [
    (s) => camelCase(s), // convert to camelCase
    (s) => s.replace(/^\d/g, (match) => '_' + match), // prepend '_' if contains a leading number
  ]

  return transformations.reduce((s, t) => t(s), rawName)
}
