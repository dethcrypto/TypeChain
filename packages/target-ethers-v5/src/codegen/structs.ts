import { StructType } from 'typechain'

import { STRUCT_POSTFIX } from '../common'
import { generateOutputType } from './types'

export function generateStruct(struct: StructType): string {
  return `
    export type ${getStructNameForInput(struct.structName)} = ${generateOutputType(struct, {
    useStructs: false,
    complexJoinOperator: '|',
  })}
    
    type ${getStructNameForOutput(struct.structName)} = ${generateOutputType(struct, {
    useStructs: false,
    complexJoinOperator: '&',
  })}
    `
}

export function getStructNameForInput(structName: string | undefined): string | undefined {
  if (typeof structName === 'string') {
    return structName + STRUCT_POSTFIX
  }
}

export function getStructNameForOutput(structName: string | undefined): string | undefined {
  if (typeof structName === 'string') {
    return structName + STRUCT_POSTFIX + '_output'
  }
}
