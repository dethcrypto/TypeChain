import { StructType } from 'typechain'

import { STRUCT_INPUT_POSTFIX, STRUCT_OUTPUT_POSTFIX } from '../common'
import { generateInputType, generateOutputType } from './types'

export function generateStruct(struct: StructType): string {
  if (struct.structName) {
    return `
      export type ${struct.structName + STRUCT_INPUT_POSTFIX} = ${generateInputType({ useStructs: false }, struct)}
      
      export type ${struct.structName + STRUCT_OUTPUT_POSTFIX} = ${generateOutputType({ useStructs: false }, struct)}
      `
  } else {
    return ''
  }
}
