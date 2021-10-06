import { StructType } from 'typechain'

import { STRUCT_POSTFIX } from '../common'
import { generateInputType, generateOutputType } from './types'

export function generateStruct(struct: StructType): string {
  return `
    export type ${getStructNameForInput(struct.structName)} = ${generateInputType({ useStructs: false }, struct)}
    
    export type ${getStructNameForOutput(struct.structName)} = ${generateOutputType({ useStructs: false }, struct)}
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
