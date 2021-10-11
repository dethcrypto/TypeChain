import {
  AbiOutputParameter,
  AbiParameter,
  createPositionalIdentifier,
  EvmOutputType,
  EvmType,
  TupleType,
} from 'typechain'

export function generateInputTypes(input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input
      .map(
        (input, index) =>
          `${createPositionalIdentifier(input.name) || `arg${index}`}: ${generateInputType(input.type)}`,
      )
      .join(', ') + ', '
  )
}

export function generateOutputTypes(outputs: Array<AbiOutputParameter>): string {
  if (outputs.length === 1) {
    return generateOutputType(outputs[0].type)
  } else {
    return generateOutputComplexType(outputs)
  }
}

// https://docs.ethers.io/ethers.js/html/api-contract.html#types
export function generateInputType(evmType: EvmType): string {
  switch (evmType.type) {
    case 'integer':
      return 'BigNumberish'
    case 'uinteger':
      return 'BigNumberish'
    case 'address':
      return 'string'
    case 'bytes':
    case 'dynamic-bytes':
      return 'Arrayish'
    case 'array':
      return `(${generateInputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return generateTupleType(evmType, generateInputType)
    case 'unknown':
      return 'any'
  }
}

export function generateOutputType(evmType: EvmOutputType): string {
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
      return `(${generateOutputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return generateOutputComplexType(evmType.components)
    case 'unknown':
      return 'any'
  }
}

export function generateTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(',') + '}'
}

/**
 * always return an array type; if there are named outputs, merge them to that type
 * this generates slightly better typings fixing: https://github.com/ethereum-ts/TypeChain/issues/232
 **/
export function generateOutputComplexType(components: AbiOutputParameter[]) {
  let namedElementsCode = ''
  const namedElements = components.filter((e) => !!e.name)
  if (namedElements.length > 0) {
    namedElementsCode = ' & {' + namedElements.map((t) => `${t.name}: ${generateOutputType(t.type)}`).join(',') + ' }'
  }
  return `[${components.map((t) => generateOutputType(t.type)).join(', ')}] ${namedElementsCode}`
}
