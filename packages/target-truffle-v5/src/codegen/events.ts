import { Contract, EventDeclaration, EventArgDeclaration, getFullSignatureAsSymbolForEvent } from 'typechain'
import { some, values } from 'lodash'

import { codegenOutputType } from './types'

export function codegenEventsDeclarations(contract: Contract): string {
  return values(contract.events)
    .filter((e) => !hasNamelessEvents(e))
    .map((e) => {
      if (e.length === 1) {
        return codegenSingleEventsDeclaration(e[0])
      } else {
        return codegenOverloadEventsDeclaration(e)
      }
    })
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

function codegenOverloadEventsDeclaration(e: EventDeclaration[]): string {
  const eventsDecls = e.map((e) => codegenSingleEventsDeclaration(e, getFullSignatureAsSymbolForEvent(e)))

  const union = `type ${e[0].name} = ${e.map((e) => getFullSignatureAsSymbolForEvent(e)).join('|')}`

  return `
  ${eventsDecls.join('\n')}

  ${union}
  `
}

function codegenSingleEventsDeclaration(e: EventDeclaration, overloadName?: string): string {
  return `
  export interface ${overloadName ?? e.name} {
    name: "${e.name}"
    args: ${codegenOutputTypesForEvents(e.inputs)}
  }
  `
}

function codegenOutputTypesForEvents(outputs: EventArgDeclaration[]): string {
  return `{
    ${outputs.map((param) => `${param.name!} : ${codegenOutputType(param.type)}, `).join('\n')}
    ${outputs.map((param, index) => index.toString() + ':' + codegenOutputType(param.type)).join(', ')}
  }`
}

function hasNamelessEvents(events: EventDeclaration[]): boolean {
  return some(events, (e) => some(e.inputs, (e) => !e.name))
}
