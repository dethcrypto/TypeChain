import { posix } from 'path'
import { Contract } from 'typechain'

export const FACTORY_POSTFIX = '__factory'
export const STRUCT_INPUT_POSTFIX = 'Struct'
export const STRUCT_OUTPUT_POSTFIX = 'StructOutput'

export function pathToCommon(contract: Contract) {
  return posix.resolve(Array.from({ length: contract.path.length }).fill('..').join('/'), './common')
}
