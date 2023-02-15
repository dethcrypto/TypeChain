/* eslint-disable import/no-extraneous-dependencies */
import {
  AbiParameter,
  CodegenConfig,
  createPositionalIdentifier,
  EventArgDeclaration,
  FunctionDeclaration,
  FunctionDocumentation,
  getSignatureForFn,
  isConstant,
  isConstantFn,
} from 'typechain'

import { generateInputType, generateInputTypes, generateOutputTypes } from './types'

interface GenerateFunctionOptions {
  overrideOutput?: string
  codegenConfig: CodegenConfig
}

export function codegenFunctions(options: GenerateFunctionOptions, fns: FunctionDeclaration[]): string {
  if (fns.length === 1) {
    if (options.codegenConfig.alwaysGenerateOverloads) {
      return generateFunction(fns[0]) + codegenForOverloadedFunctions(fns)
    } else {
      return generateFunction(fns[0])
    }
  }

  return codegenForOverloadedFunctions(fns)
}

export function codegenForOverloadedFunctions(fns: FunctionDeclaration[]): string {
  return fns.map((fn) => generateFunction(fn, `"${getSignatureForFn(fn)}"`)).join('\n')
}

function isPayable(fn: FunctionDeclaration): boolean {
  return fn.stateMutability === 'payable'
}

function generateFunctionReturnType(fn: FunctionDeclaration): string {
  let stateMutability
  if (isConstant(fn) || isConstantFn(fn)) {
    stateMutability = 'view'
  } else if (isPayable(fn)) {
    stateMutability = 'payable'
  } else {
    stateMutability = 'nonpayable'
  }

  return `TypedContractMethod<
      [${generateInputTypes(fn.inputs, { useStructs: true })}],
      [${generateOutputTypes({ returnResultObject: false, useStructs: true }, fn.outputs)}],
      '${stateMutability}'
    >`
}

function generateFunction(fn: FunctionDeclaration, overloadedName?: string): string {
  return `
    ${generateFunctionDocumentation(fn.documentation)}
    ${overloadedName ?? fn.name}: ${generateFunctionReturnType(fn)}
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
  return `'${getSignatureForFn(fn)}': FunctionFragment;`
}

export function generateFunctionNameOrSignature(fn: FunctionDeclaration, useSignature: boolean) {
  return useSignature ? getSignatureForFn(fn) : fn.name
}

export function generateGetFunctionForInterface(args: string[]): string {
  if (args.length === 0) return ''

  return `getFunction(nameOrSignature: ${args.map((s) => `"${s}"`).join(' | ')}): FunctionFragment;`
}

export function generateGetFunctionForContract(fn: FunctionDeclaration, useSignature: boolean): string {
  return `getFunction(nameOrSignature: '${generateFunctionNameOrSignature(
    fn,
    useSignature,
  )}'): ${generateFunctionReturnType(fn)};`
}

export function generateEncodeFunctionDataOverload(fn: FunctionDeclaration, useSignature: boolean): string {
  const methodInputs = [`functionFragment: '${useSignature ? getSignatureForFn(fn) : fn.name}'`]

  if (fn.inputs.length) {
    methodInputs.push(
      `values: [${fn.inputs.map((input) => generateInputType({ useStructs: true }, input.type)).join(', ')}]`,
    )
  } else {
    methodInputs.push('values?: undefined')
  }

  return `encodeFunctionData(${methodInputs.join(', ')}): string;`
}

export function generateDecodeFunctionResultOverload(fn: FunctionDeclaration, useSignature: boolean): string {
  return `decodeFunctionResult(functionFragment: '${
    useSignature ? getSignatureForFn(fn) : fn.name
  }', data: BytesLike): Result;`
}

export function generateParamNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return params.map((param, index) => (param.name ? createPositionalIdentifier(param.name) : `arg${index}`)).join(', ')
}

export const FUNCTION_IMPORTS = ['TypedContractMethod', 'NonPayableOverrides', 'PayableOverrides', 'ViewOverrides']
