import { FunctionDeclaration, FunctionDocumentation, getSignatureForFn } from 'typechain'

import { generateInputTypes, generateOutputTypes } from './types'

interface GenerateFunctionOptions {
  overrideOutput?: string
}

export function codegenFunctions(options: GenerateFunctionOptions, fns: FunctionDeclaration[]): string {
  if (fns.length === 1) {
    return `${generateFunction(options, fns[0])}${codegenForOverloadedFunctions(options, fns)}`
  }

  return `${generateFunction(options, fns[0])}${codegenForOverloadedFunctions(options, fns)}`
}

export function codegenForOverloadedFunctions(options: GenerateFunctionOptions, fns: FunctionDeclaration[]): string {
  return fns.map((fn) => generateFunction(options, fn, `"${getSignatureForFn(fn)}"`)).join('\n')
}

function generateFunction(options: GenerateFunctionOptions, fn: FunctionDeclaration, overloadedName?: string): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${generateInputTypes(fn.inputs)} overrides?: TransactionOverrides): ${
    options.overrideOutput
      ? options.overrideOutput
      : `Promise<${
          fn.stateMutability === 'pure' || fn.stateMutability === 'view'
            ? generateOutputTypes(fn.outputs)
            : 'ContractTransaction'
        }>`
  };
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
