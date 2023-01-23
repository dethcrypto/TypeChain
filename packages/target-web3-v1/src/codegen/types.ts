import { compact } from 'lodash'
import { AbiOutputParameter, AbiParameter, EvmOutputType, EvmType, TupleType } from 'typechain'

import { STRUCT_INPUT_POSTFIX, STRUCT_OUTPUT_POSTFIX } from '../common'

interface GenerateTypeOptions {
  returnResultObject?: boolean
  useStructs?: boolean // uses struct type for first depth, if false then generates first depth tuple types
}

export function codegenInputTypes(options: GenerateTypeOptions, input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input.map((input, index) => `${input.name || `arg${index}`}: ${codegenInputType(options, input.type)}`).join(', ') +
    ', '
  )
}

export function codegenOutputTypes(options: GenerateTypeOptions, outputs: Array<AbiOutputParameter>): string {
  if (!options.returnResultObject && outputs.length === 1) {
    return codegenOutputType(options, outputs[0].type)
  } else {
    return codegenOutputComplexType(outputs, options)
  }
}

export function codegenInputType(options: GenerateTypeOptions, evmType: EvmType): string {
  switch (evmType.type) {
    case 'integer':
    case 'uinteger':
      return 'number | string | BN'
    case 'address':
      return 'string'
    case 'bytes':
    case 'dynamic-bytes':
      return 'string | number[]'
    case 'array':
      return codegenArrayOrTupleType(codegenInputType(options, evmType.itemType), evmType.size)
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      if (evmType.structName && options.useStructs) {
        return evmType.structName.toString() + STRUCT_INPUT_POSTFIX
      }
      return codegenInputComplexType(evmType.components, { ...options, useStructs: true })
    case 'unknown':
      return 'any'
  }
}

export function codegenOutputType(options: GenerateTypeOptions, evmType: EvmOutputType): string {
  switch (evmType.type) {
    case 'integer':
      return 'string'
    case 'uinteger':
      return 'string'
    case 'address':
      return 'string'
    case 'void':
      return 'void'
    case 'bytes':
    case 'dynamic-bytes':
      return 'string'
    case 'array':
      return codegenArrayOrTupleType(codegenOutputType(options, evmType.itemType), evmType.size)
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      if (evmType.structName && options.useStructs) {
        return evmType.structName.toString() + STRUCT_OUTPUT_POSTFIX
      }
      return codegenOutputComplexType(evmType.components, { ...options, useStructs: true })
    case 'unknown':
      return 'any'
  }
}

export function codegenArrayOrTupleType(item: string, length?: number) {
  if (length !== undefined && length < 6) {
    return `[${Array(length).fill(item).join(', ')}]`
  } else {
    return `${item}[]`
  }
}

export function codegenObjectTypeLiteral(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(', ') + '}'
}

/**
 * Always return an array type; if there are named outputs, merge them to that type
 * this generates slightly better typings fixing: https://github.com/ethereum-ts/TypeChain/issues/232
 **/
export function codegenOutputComplexType(components: AbiOutputParameter[], options: GenerateTypeOptions) {
  const existingOutputComponents = compact([
    codegenOutputComplexTypeAsArray(components, options),
    codegenOutputComplexTypesAsObject(components, options),
  ])
  return existingOutputComponents.join(' & ')
}

export function codegenInputComplexType(components: AbiParameter[], options: GenerateTypeOptions) {
  const existingOutputComponents = compact([
    codegenInputComplexTypeAsArray(components, options),
    codegenInputComplexTypesAsObject(components, options),
  ])
  return existingOutputComponents.join(' | ')
}
export function codegenOutputComplexTypeAsArray(
  components: AbiOutputParameter[],
  options: GenerateTypeOptions,
): string {
  return `[${components.map((t) => codegenOutputType(options, t.type)).join(', ')}]`
}

export function codegenOutputComplexTypesAsObject(
  components: AbiOutputParameter[],
  options: GenerateTypeOptions,
): string | undefined {
  let namedElementsCode
  const namedElements = components.filter((e) => !!e.name)
  if (namedElements.length > 0) {
    namedElementsCode =
      '{' + namedElements.map((t) => `${t.name}: ${codegenOutputType(options, t.type)}`).join(', ') + ' }'

  }

  return namedElementsCode
}

export function codegenInputComplexTypeAsArray(components: AbiParameter[], options: GenerateTypeOptions): string {
  return `[${components.map((t) => codegenInputType(options, t.type)).join(', ')}]`
}

export function codegenInputComplexTypesAsObject(
  components: AbiParameter[],
  options: GenerateTypeOptions,
): string | undefined {
  let namedElementsCode
  const namedElements = components.filter((e) => !!e.name)
  if (namedElements.length > 0) {
    namedElementsCode =
      '{' + namedElements.map((t) => `${t.name}: ${codegenInputType(options, t.type)}`).join(', ') + ' }'
  }

  return namedElementsCode
}
