import { BaseContract } from 'ethers'

export const ethersPassProperties = new Set(['then'])
export const baseContractProperties = new Set([
  ...Object.getOwnPropertyNames(BaseContract.prototype), // for methods
  ...Object.keys(new BaseContract('0x', [])), // for readOnly properties
])

export const reservedKeywordsLabels = new Set([
  'class',
  'function',
  'interface',
  'extends',
  'implements',
  'constructor',
  'super',
  'this',
  'let',
  'var',
  'const',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'new',
  'delete',
  'return',
  'in',
  'instanceof',
  'typeof',
  'void',
  'yield',
  'export',
  'import',
  'as',
  'get',
  'set',
  'is',
  'namespace',
  'type',
  'debugger',
  'async',
  'await',
  'of',
])
