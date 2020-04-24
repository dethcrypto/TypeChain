import { values } from 'lodash'
import { Dictionary } from 'ts-essentials'
import { FunctionDeclaration, FunctionDocumentation, getSignatureForFn } from 'typechain'

import { codegenInputTypes, codegenOutputTypes } from './types'

export function codegenForFunctions(fns: Dictionary<FunctionDeclaration[]>): string {
  return values(fns)
    .map((fns) => {
      if (fns.length === 1) {
        return codegenForSingleFunction(fns[0])
      } else {
        return codegenForOverloadedFunctions(fns)
      }
    })
    .join('\n')
}

function codegenForOverloadedFunctions(fns: FunctionDeclaration[]): string {
  return fns.map((f) => codegenForSingleFunction(f, `"${getSignatureForFn(f)}"`)).join('\n')
}

function codegenForSingleFunction(fn: FunctionDeclaration, overloadedName?: string): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${codegenInputTypes(fn.inputs)}): ${getTransactionObject(fn)}<${codegenOutputTypes(
    fn.outputs,
  )}>;
`
}

function getTransactionObject(fn: FunctionDeclaration): string {
  return fn.stateMutability === 'payable' ? 'PayableTransactionObject' : 'NonPayableTransactionObject'
}

function generateFunctionDocumentation(doc?: FunctionDocumentation): string {
  if (!doc) return ''

  let docString = '/**'
  if (doc.details) docString += `\n * ${doc.details}`
  if (doc.notice) docString += `\n * ${doc.notice}`

  const params = Object.entries(doc.params || {})
  if (params.length) {
    params.forEach(([key, value]) => {
      docString += `\n * @param ${key} ${value}`
    })
  }

  if (doc.return) docString += `\n * @returns ${doc.return}`

  docString += '\n */'

  return docString
}
