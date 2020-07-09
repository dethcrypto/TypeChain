import { EvmType, EvmOutputType, TupleType, AbiParameter, AbiOutputParameter } from 'typechain'

export function generateInputTypes(input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input.map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(input.type)}`).join(', ') + ', '
  )
}

export function generateOutputTypes(returnResultObject: boolean, outputs: Array<AbiOutputParameter>): string {
  if (!returnResultObject && outputs.length === 1) {
    return generateOutputType(outputs[0].type)
  } else {
    return `{
      ${outputs.map((t) => t.name && `${t.name}: ${generateOutputType(t.type)}, `).join('')}
      ${outputs.map((t, i) => `${i}: ${generateOutputType(t.type)}`).join(', ')}
      }`
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
      return generateOutputTupleType(evmType)
  }
}

export function generateTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(',') + '}'
}

export function generateOutputTupleType(tuple: TupleType) {
  return (
    '{' +
    tuple.components.map((component) => `${component.name}: ${generateOutputType(component.type)} ,`).join('\n') +
    tuple.components.map((component, index) => `${index}: ${generateOutputType(component.type)}`).join(', ') +
    '}'
  )
}
