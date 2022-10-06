import { values } from 'lodash'
import { Dictionary } from 'ts-essentials'
import { CodegenConfig, FunctionDeclaration, FunctionDocumentation, getSignatureForFn } from 'typechain'

import { codegenInputTypes, codegenOutputTypes } from './types'

interface GenerateFunctionOptions {
  returnResultObject?: boolean
  isStaticCall?: boolean
  overrideOutput?: string
  codegenConfig: CodegenConfig
}

export function codegenForFunctions(fns: Dictionary<FunctionDeclaration[]>, options: GenerateFunctionOptions): string {
  return values(fns)
    .map((fns) => {
      if (fns.length === 1) {
        return codegenForSingleFunction(fns[0], options)
      } else {
        return codegenForOverloadedFunctions(fns, options)
      }
    })
    .join('\n')
}

function codegenForOverloadedFunctions(fns: FunctionDeclaration[], options: GenerateFunctionOptions): string {
  return fns.map((f) => codegenForSingleFunction(f, options, `"${getSignatureForFn(f)}"`)).join('\n')
}

function codegenForSingleFunction(
  fn: FunctionDeclaration,
  options: GenerateFunctionOptions,
  overloadedName?: string,
): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${codegenInputTypes({ useStructs: true }, fn.inputs)}): ${getTransactionObject(
    fn,
  )}<${codegenOutputTypes(
    { returnResultObject: !!options.returnResultObject, useStructs: true},
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
