import { AbiParameter, AbiOutputParameter, EvmType, EvmOutputType, TupleType } from 'typechain'

export function codegenInputTypes(input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input.map((input, index) => `${input.name || `arg${index}`}: ${codegenInputType(input.type)}`).join(', ') + ', '
  )
}

export function codegenOutputTypes(outputs: Array<AbiOutputParameter>): string {
  if (outputs.length === 1) {
    return codegenOutputType(outputs[0].type)
  } else {
    return `[${outputs.map((param) => codegenOutputType(param.type)).join(', ')}]`
  }
}

export function codegenInputType(evmType: EvmType): string {
  switch (evmType.type) {
    case 'integer':
      return 'number | BN | string'
    case 'uinteger':
      return 'number | BN | string'
    case 'address':
      return 'string'
    case 'bytes':
      return 'string'
    case 'dynamic-bytes':
      return 'string'
    case 'array':
      return `(${codegenInputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return codegenTupleType(evmType, codegenInputType)
    case 'unknown':
      return 'unknown'
  }
}

export function codegenOutputType(evmType: EvmOutputType): string {
  switch (evmType.type) {
    case 'integer':
      return 'BN'
    case 'uinteger':
      return 'BN'
    case 'address':
      return 'string'
    case 'void':
      return 'void'
    case 'bytes':
    case 'dynamic-bytes':
      return 'string'
    case 'array':
      return `(${codegenOutputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return codegenTupleType(evmType, codegenOutputType)
    case 'unknown':
      return 'unknown'
  }
}

function codegenTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(', ') + '}'
}
