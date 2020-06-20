import { FunctionDeclaration, isConstant, isConstantFn, FunctionDocumentation, getSignatureForFn } from 'typechain'
import { generateInputTypes, generateOutputTypes } from './types'

export function codegenFunctions(returnResultObject: boolean, fns: FunctionDeclaration[]): string {
  if (fns.length === 1) {
    return generateFunction(returnResultObject, fns[0])
  }

  return codegenForOverloadedFunctions(returnResultObject, fns)
}

export function codegenForOverloadedFunctions(returnResultObject: boolean, fns: FunctionDeclaration[]): string {
  return fns.map((fn) => generateFunction(returnResultObject, fn, `"${getSignatureForFn(fn)}"`)).join('\n')
}

function isPayable(fn: FunctionDeclaration): boolean {
  return fn.stateMutability === 'payable'
}

function generateFunction(returnResultObject: boolean, fn: FunctionDeclaration, overloadedName?: string): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${generateInputTypes(fn.inputs)}${
    !isConstant(fn) && !isConstantFn(fn) ? `overrides?: ${isPayable(fn) ? 'PayableOverrides' : 'Overrides'}` : ''
  }): Promise<${
    fn.stateMutability === 'pure' || fn.stateMutability === 'view'
      ? generateOutputTypes(returnResultObject, fn.outputs)
      : 'ContractTransaction'
  }>;
`
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
