import { EvmType, EvmOutputType, TupleType, AbiParameter, AbiOutputParameter } from 'typechain'

export function codegenInputTypes(input: AbiParameter[]): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input.map((input, index) => `${input.name || `arg${index}`}: ${codegenInputType(input.type)}`).join(', ') + ', '
  )
}

export function codegenOutputTypes(outputs: AbiOutputParameter[]): string {
  if (outputs.length === 1) {
    return codegenOutputType(outputs[0].type)
  } else {
    return `{
      ${outputs.map((t) => t.name && `${t.name}: ${codegenOutputType(t.type)}, `).join('')}
      ${outputs.map((t, i) => `${i}: ${codegenOutputType(t.type)}`).join(', ')}
    }`
  }
}

export function codegenInputType(evmType: EvmType): string {
  switch (evmType.type) {
    case 'integer':
    case 'uinteger':
      return 'number | string'
    case 'address':
      return 'string'
    case 'bytes':
    case 'dynamic-bytes':
      return 'string | number[]'
    case 'array':
      return `(${codegenInputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return codegenTupleType(evmType, codegenInputType)
  }
}

export function codegenOutputType(evmType: EvmOutputType): string {
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
      return `(${codegenOutputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return codegenTupleType(evmType, codegenOutputType)
  }
}

export function codegenTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '[' + tuple.components.map((component) => generator(component.type)).join(', ') + ']'
}
