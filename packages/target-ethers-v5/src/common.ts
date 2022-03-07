import { posix } from 'path'
import { Contract } from 'typechain'

export const FACTORY_POSTFIX = '__factory'
export const STRUCT_INPUT_POSTFIX = 'Struct'
export const STRUCT_OUTPUT_POSTFIX = 'StructOutput'

export function pathFromRoot(contract: Contract, last: string) {
  return posix.resolve(new Array(contract.path.length + 1).fill('..').join('/'), last)
}
