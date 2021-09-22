import { EventArgDeclaration, EventDeclaration } from 'typechain'

import { generateInputType, generateOutputComplexTypeAsArray, generateOutputComplexTypesAsObject } from './types'

export function generateEventFilters(events: EventDeclaration[]) {
  if (events.length === 1) {
    return generateEventFilter(events[0], true)
  } else {
    return events.map((e) => generateEventFilter(e, false)).join('\n')
  }
}

export function generateEventFilter(event: EventDeclaration, includeNameFilter: boolean) {
  const components = event.inputs.map((input, i) => ({ name: input.name ?? `arg${i.toString()}`, type: input.type }))
  const arrayOutput = generateOutputComplexTypeAsArray(components)
  const objectOutput = generateOutputComplexTypesAsObject(components) || '{}'

  let filter = `
    '${generateEventSignature(event)}'(${generateEventTypes(
    event.inputs,
  )}): TypedEventFilter<${arrayOutput}, ${objectOutput}>;
    `

  if (includeNameFilter) {
    filter += `
      ${event.name}(${generateEventTypes(event.inputs)}): TypedEventFilter<${arrayOutput}, ${objectOutput}>;
      `
  }
  return filter
}

export function generateEventTypeExports(events: EventDeclaration[]) {
  if (events.length === 1) {
    return generateEventTypeExport(events[0], false)
  } else {
    return events.map((e) => generateEventTypeExport(e, true)).join('\n')
  }
}

export function generateEventTypeExport(event: EventDeclaration, includeArgTypes: boolean) {
  const components = event.inputs.map((input, i) => ({ name: input.name ?? `arg${i.toString()}`, type: input.type }))
  const arrayOutput = generateOutputComplexTypeAsArray(components)
  const objectOutput = generateOutputComplexTypesAsObject(components) || '{}'

  return `
  export type ${event.name}${
    includeArgTypes ? event.inputs.map((input) => '_' + input.type.originalType).join('') + '_Event' : 'Event'
  } = TypedEvent<${arrayOutput} & ${objectOutput}>;
  `
}

export function generateInterfaceEventDescription(event: EventDeclaration): string {
  return `'${generateEventSignature(event)}': EventFragment;`
}

export function generateEventSignature(event: EventDeclaration): string {
  return `${event.name}(${event.inputs.map((input: any) => input.type.originalType).join(',')})`
}

export function generateEventTypes(eventArgs: EventArgDeclaration[]) {
  if (eventArgs.length === 0) {
    return ''
  }
  return (
    eventArgs
      .map((arg) => {
        return `${arg.name}?: ${generateEventArgType(arg)}`
      })
      .join(', ') + ', '
  )
}

export function generateEventArgType(eventArg: EventArgDeclaration): string {
  return eventArg.isIndexed ? `${generateInputType(eventArg.type)} | null` : 'null'
}

export function generateGetEventOverload(event: EventDeclaration): string {
  return `getEvent(nameOrSignatureOrTopic: '${event.name}'): EventFragment;`
}
