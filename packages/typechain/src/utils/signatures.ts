import { EventDeclaration } from '../parser/abiParser'

export function getFullSignatureAsSymbolForEvent(event: EventDeclaration): string {
  return `${event.name}_${event.inputs.map((e) => e.type.originalType).join('_')}`
}

export function getFullSignatureForEvent(event: EventDeclaration): string {
  return `${event.name}(${event.inputs.map((e) => e.type.originalType).join(',')})`
}

export function getIndexedSignatureForEvent(event: EventDeclaration): string {
  const indexedType = event.inputs.filter((e) => e.isIndexed)
  return `${event.name}(${indexedType.map((e) => e.type.originalType).join(',')})`
}
