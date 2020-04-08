import { values } from 'lodash'
import { Dictionary } from 'ts-essentials'
import { FunctionDeclaration } from 'typechain'

import { codegenInputTypes, codegenOutputTypes } from './types'

export function codegenForFunctions(fns: Dictionary<FunctionDeclaration[]>): string {
  return values(fns)
    .map((v) => v[0])
    .map(codegenForSingleFunction)
    .join('\n')
}

function codegenForSingleFunction(fn: FunctionDeclaration): string {
  return `
  ${fn.name}(${codegenInputTypes(fn.inputs)}): ${getTransactionObject(fn)}<${codegenOutputTypes(fn.outputs)}>;
`
}

function getTransactionObject(fn: FunctionDeclaration): string {
  return fn.stateMutability === 'payable' ? 'PayableTransactionObject' : 'NonPayableTransactionObject'
}
