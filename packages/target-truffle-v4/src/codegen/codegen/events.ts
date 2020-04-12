import { Contract, EventDeclaration, EventArgDeclaration } from 'typechain'
import { some, values } from 'lodash'

import { codegenOutputType } from './types'

export function codegenEventsDeclarations(contract: Contract): string {
  return values(contract.events)
    .filter((e) => !hasNamelessEvents(e))
    .map((e) => e[0])
    .filter((e) => !e.isAnonymous)
    .map((e) => codegenEventsDeclaration(e))
    .join('\n')
}

export function codegenAllPossibleEvents(contract: Contract): string {
  const allPossibleEvents = values(contract.events)
    .filter((e) => !hasNamelessEvents(e))
    .map((e) => e[0])
    .filter((e) => !e.isAnonymous)
    .map((e) => e.name)

  if (allPossibleEvents.length === 0) {
    return `type AllEvents = never`
  }
  return `type AllEvents = ${allPossibleEvents.join(' | ')};`
}

function codegenEventsDeclaration(e: EventDeclaration): string {
  return `
  export interface ${e.name} {
    name: "${e.name}"
    args: ${codegenOutputTypesForEvents(e.inputs)}
  }
  `
}

function codegenOutputTypesForEvents(outputs: EventArgDeclaration[]): string {
  return `{
    ${outputs.map((param) => param.name! + ':' + codegenOutputType(param.type)).join(', ')}
  }`
}

function hasNamelessEvents(events: EventDeclaration[]): boolean {
  return some(events, (e) => some(e.inputs, (e) => !e.name))
}
