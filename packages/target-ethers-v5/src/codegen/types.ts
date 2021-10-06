import { compact } from 'lodash'
import { AbiOutputParameter, AbiParameter, EvmOutputType, EvmType, TupleType } from 'typechain'

import { getStructNameForInput, getStructNameForOutput } from './structs'

interface GenerateTypeOptions {
  returnResultObject?: boolean
  useStructs?: boolean // uses struct type for first depth, if false then generates first depth tuple types
  complexJoinOperator?: '&' | '|'
}

export function generateInputTypes(input: Array<AbiParameter>, options: GenerateTypeOptions): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input
      .map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(options, input.type)}`)
      .join(', ') + ', '
  )
}

export function generateOutputTypes(options: GenerateTypeOptions, outputs: Array<AbiOutputParameter>): string {
  if (!options.returnResultObject && outputs.length === 1) {
    return generateOutputType(outputs[0].type, options)
  } else {
    return generateOutputComplexType(outputs, options)
  }
}

// https://docs.ethers.io/ethers.js/html/api-contract.html#types
export function generateInputType(options: GenerateTypeOptions, evmType: EvmType): string {
  switch (evmType.type) {
    case 'integer':
      return 'BigNumberish'
    case 'uinteger':
      return 'BigNumberish'
    case 'address':
      return 'string'
    case 'bytes':
    case 'dynamic-bytes':
      return 'BytesLike'
    case 'array':
      if (evmType.size !== undefined) {
        return `[${Array(evmType.size)
          .fill(generateInputType({ ...options, useStructs: true }, evmType.itemType))
          .join(', ')}]`
      } else {
        if (options.useStructs) {
          const structName = getStructNameForInput(evmType.structName)
          if (structName) {
            return structName + '[]'
          }
        }
        return `(${generateInputType({ ...options, useStructs: true }, evmType.itemType)})[]`
      }
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      if (options.useStructs) {
        const structName = getStructNameForInput(evmType.structName)
        if (structName) {
          return structName
        }
      }
      return generateTupleType(evmType, generateInputType.bind(null, { ...options, useStructs: true }))
    case 'unknown':
      return 'any'
  }
}

export function generateOutputType(evmType: EvmOutputType, options: GenerateTypeOptions): string {
  switch (evmType.type) {
    case 'integer':
    case 'uinteger':
      return evmType.bits <= 48 ? 'number' : 'BigNumber'
    case 'address':
      return 'string'
    case 'void':
      return 'void'
    case 'bytes':
    case 'dynamic-bytes':
      return 'string'
    case 'array':
      if (evmType.size !== undefined) {
        return `[${Array(evmType.size)
          .fill(generateOutputType(evmType.itemType, { ...options, useStructs: true }))
          .join(', ')}]`
      } else {
        if (options.useStructs) {
          const structName = getStructNameForOutput(evmType.structName)
          if (structName) {
            return structName + '[]'
          }
        }
        return `(${generateOutputType(evmType.itemType, { ...options, useStructs: true })})[]`
      }
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      if (options.useStructs) {
        const structName = getStructNameForOutput(evmType.structName)
        if (structName) {
          return structName
        }
      }
      return generateOutputComplexType(evmType.components, { ...options, useStructs: true })
    case 'unknown':
      return 'any'
  }
}

export function generateTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(',') + '}'
}

/**
 * Always return an array type; if there are named outputs, merge them to that type
 * this generates slightly better typings fixing: https://github.com/ethereum-ts/TypeChain/issues/232
 **/
export function generateOutputComplexType(components: AbiOutputParameter[], options: GenerateTypeOptions) {
  const existingOutputComponents = compact([
    generateOutputComplexTypeAsArray(components, options),
    generateOutputComplexTypesAsObject(components, options),
  ])
  return existingOutputComponents.join(' ' + (options.complexJoinOperator ?? '&') + ' ')
}

export function generateOutputComplexTypeAsArray(
  components: AbiOutputParameter[],
  options: GenerateTypeOptions,
): string {
  return `[${components.map((t) => generateOutputType(t.type, options)).join(', ')}]`
}

export function generateOutputComplexTypesAsObject(
  components: AbiOutputParameter[],
  options: GenerateTypeOptions,
): string | undefined {
  let namedElementsCode
  const namedElements = components.filter((e) => !!e.name)
  if (namedElements.length > 0) {
    namedElementsCode =
      '{' + namedElements.map((t) => `${t.name}: ${generateOutputType(t.type, options)}`).join(',') + ' }'
  }

  return namedElementsCode
}
