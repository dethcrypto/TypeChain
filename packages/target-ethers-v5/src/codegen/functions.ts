import {
  AbiParameter,
  CodegenConfig,
  EventArgDeclaration,
  FunctionDeclaration,
  FunctionDocumentation,
  getSignatureForFn,
  isConstant,
  isConstantFn,
} from 'typechain'

import { generateInputType, generateInputTypes, generateOutputTypes } from './types'

interface GenerateFunctionOptions {
  returnResultObject?: boolean
  isStaticCall?: boolean
  overrideOutput?: string
  codegenConfig: CodegenConfig
}

export function codegenFunctions(options: GenerateFunctionOptions, fns: FunctionDeclaration[]): string {
  if (fns.length === 1) {
    if (options.codegenConfig.alwaysGenerateOverloads) {
      return generateFunction(options, fns[0]) + codegenForOverloadedFunctions(options, fns)
    } else {
      return generateFunction(options, fns[0])
    }
  }

  return codegenForOverloadedFunctions(options, fns)
}

export function codegenForOverloadedFunctions(options: GenerateFunctionOptions, fns: FunctionDeclaration[]): string {
  return fns.map((fn) => generateFunction(options, fn, `"${getSignatureForFn(fn)}"`)).join('\n')
}

function isPayable(fn: FunctionDeclaration): boolean {
  return fn.stateMutability === 'payable'
}

function generateFunction(options: GenerateFunctionOptions, fn: FunctionDeclaration, overloadedName?: string): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${generateInputTypes(fn.inputs)}${
    !options.isStaticCall && !isConstant(fn) && !isConstantFn(fn)
      ? `overrides?: ${
          isPayable(fn)
            ? 'PayableOverrides & { from?: string | Promise<string> }'
            : 'Overrides & { from?: string | Promise<string> }'
        }`
      : 'overrides?: CallOverrides'
  }): ${
    options.overrideOutput ??
    `Promise<${
      options.isStaticCall || fn.stateMutability === 'pure' || fn.stateMutability === 'view'
        ? generateOutputTypes(!!options.returnResultObject, fn.outputs)
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

export function generateInterfaceFunctionDescription(fn: FunctionDeclaration): string {
  return `'${generateFunctionSignature(fn)}': FunctionFragment;`
}

export function generateFunctionSignature(fn: FunctionDeclaration): string {
  return `${fn.name}(${fn.inputs.map((input: any) => input.type.originalType).join(',')})`
}

export function generateEncodeFunctionDataOverload(fn: FunctionDeclaration): string {
  const methodInputs = [`functionFragment: '${fn.name}'`]

  if (fn.inputs.length) {
    methodInputs.push(`values: [${fn.inputs.map((input) => generateInputType(input.type)).join(', ')}]`)
  } else {
    methodInputs.push('values?: undefined')
  }

  return `encodeFunctionData(${methodInputs.join(', ')}): string;`
}

export function generateDecodeFunctionResultOverload(fn: FunctionDeclaration): string {
  return `decodeFunctionResult(functionFragment: '${fn.name}', data: BytesLike): Result;`
}

export function generateParamNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return params.map((param, index) => param.name || `arg${index}`).join(', ')
}
