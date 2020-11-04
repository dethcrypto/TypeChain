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
      return 'number | BigNumber | string'
    case 'uinteger':
      return 'number | BigNumber | string'
    case 'address':
      return 'string | BigNumber'
    case 'bytes':
      return 'string | BigNumber'
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
      return 'any'
  }
}

export function codegenOutputType(evmType: EvmOutputType): string {
  switch (evmType.type) {
    case 'integer':
      return 'BigNumber'
    case 'uinteger':
      return 'BigNumber'
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
      return 'any'
  }
}

function codegenTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '{' + tuple.components.map((component) => `${component.name}: ${generator(component.type)}`).join(', ') + '}'
}
