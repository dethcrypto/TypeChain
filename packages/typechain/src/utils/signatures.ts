import { AbiParameter, EventArgDeclaration, EventDeclaration, FunctionDeclaration } from '../parser/abiParser'
import { ArrayType, TupleType } from '../parser/parseEvmType'

export function getFullSignatureAsSymbolForEvent(event: EventDeclaration): string {
  return `${event.name}_${event.inputs
    .map((e) => {
      if (e.type.type === 'array') {
        return e.type.itemType.originalType + '_array'
      } else {
        return e.type.originalType
      }
    })
    .join('_')}`
}

export function getFullSignatureForEvent(event: EventDeclaration): string {
  return `${event.name}(${event.inputs.map((e) => getArgumentForSignature(e)).join(',')})`
}

export function getIndexedSignatureForEvent(event: EventDeclaration): string {
  const indexedType = event.inputs.filter((e) => e.isIndexed)
  return `${event.name}(${indexedType.map((e) => getArgumentForSignature(e)).join(',')})`
}

export function getArgumentForSignature(argument: EventArgDeclaration | AbiParameter): string {
  if (argument.type.originalType === 'tuple') {
    return `(${(argument.type as TupleType).components.map((i) => getArgumentForSignature(i)).join(',')})`
  } else if (argument.type.originalType.startsWith('tuple')) {
    const arr = argument.type as ArrayType
    return `${getArgumentForSignature({ name: '', type: arr.itemType })}[${arr.size?.toString() || ''}]`
  } else {
    return argument.type.originalType
  }
}

export function getSignatureForFn(fn: FunctionDeclaration): string {
  return `${fn.name}(${fn.inputs.map((i) => getArgumentForSignature(i)).join(',')})`
}
