/**
 * A set of reserved words in EcmaScript 2021
 * @see https://262.ecma-international.org/12.0/#prod-ReservedWord
 */
// prettier-ignore
const RESERVED_WORDS = new Set([
  'await',    'break',      'case',
  'catch',    'class',      'const',
  'continue', 'debugger',   'default',
  'delete',   'do',         'else',
  'enum',     'export',     'extends',
  'false',    'finally',    'for',
  'function', 'if',         'import',
  'in',       'instanceof', 'new',
  'null',     'return',     'super',
  'switch',   'this',       'throw',
  'true',     'try',        'typeof',
  'var',      'void',       'while',
  'with',     'yield'
])

/*
 * Creates an identifier prefixing reserved words with `_`.
 */
export function createIdentifier(identifierName: string) {
  if (RESERVED_WORDS.has(identifierName)) {
    return `_${identifierName}`
  }
  return identifierName
}
