import { values } from 'lodash'
import { Contract, EventArgDeclaration, EventDeclaration, getFullSignatureAsSymbolForEvent } from 'typechain'

import { codegenOutputType } from './types'

export function codegenEventsDeclarations(contract: Contract): string {
  return values(contract.events)
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
    .map((e) => e[0])
    .filter((e) => !e.isAnonymous)
    .map((e) => e.name)

  if (allPossibleEvents.length === 0) {
    return `type AllEvents = never`
  }
  return `type AllEvents = ${allPossibleEvents.join(' | ')};`
}

export function codegenEventsEmitters(contract: Contract): string {
  return values(contract.events)
    .filter((e) => !e[0].isAnonymous) // ignore anon events
    .map((e) => {
      if (e.length === 1) {
        return codegenSingleEventsEmitter(e[0])
      } else {
        return '' //todo
      }
    })
    .join('\n')
}

function codegenSingleEventsEmitter(e: EventDeclaration, overloadName?: string, overloadType?: string): string {
  return `${overloadName ?? e.name}(cb?: Callback<${overloadType ?? e.name}>): EventEmitter;`
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
    ${outputs.map((param) => (param.name ? `${param.name} : ${codegenOutputType(param.type)}, ` : '')).join('\n')}
    ${outputs.map((param, index) => index.toString() + ':' + codegenOutputType(param.type)).join(', ')}
  }`
}
