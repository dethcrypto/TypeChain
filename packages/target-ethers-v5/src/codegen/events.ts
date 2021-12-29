import {
  createPositionalIdentifier,
  EventArgDeclaration,
  EventDeclaration,
  getFullSignatureAsSymbolForEvent,
} from 'typechain'

import { generateInputType, generateOutputComplexTypeAsArray, generateOutputComplexTypesAsObject } from './types'

export function generateEventFilters(events: EventDeclaration[]) {
  if (events.length === 1) {
    const event = events[0]
    const typedEventFilter = `${generateEventIdentifier(event, { includeArgTypes: false })}Filter`

    return `
      '${generateEventSignature(event)}'(${generateEventInputs(event.inputs)}): ${typedEventFilter};
      ${event.name}(${generateEventInputs(event.inputs)}): ${typedEventFilter};
    `
  } else {
    return events
      .map((event) => {
        const typedEventFilter = `${generateEventIdentifier(event, { includeArgTypes: true })}Filter`

        return `'${generateEventSignature(event)}'(${generateEventInputs(event.inputs)}): ${typedEventFilter};`
      })
      .join('\n')
  }
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
  const arrayOutput = generateOutputComplexTypeAsArray(components, { useStructs: true })
  const objectOutput = generateOutputComplexTypesAsObject(components, { useStructs: true }) || '{}'

  const identifier = generateEventIdentifier(event, { includeArgTypes })

  return `
    export type ${identifier} = TypedEvent<${arrayOutput}, ${objectOutput}>;

    export type ${identifier}Filter = TypedEventFilter<${identifier}>;
  `
}

export function generateInterfaceEventDescription(event: EventDeclaration): string {
  return `'${generateEventSignature(event)}': EventFragment;`
}

export function generateEventSignature(event: EventDeclaration): string {
  return `${event.name}(${event.inputs.map((input: any) => input.type.originalType).join(',')})`
}

export function generateEventInputs(eventArgs: EventArgDeclaration[]) {
  if (eventArgs.length === 0) {
    return ''
  }
  return (
    eventArgs
      .map((arg, index) => {
        return `${arg.name ? createPositionalIdentifier(arg.name) : `arg${index}`}?: ${generateEventArgType(arg)}`
      })
      .join(', ') + ', '
  )
}

export function generateEventArgType(eventArg: EventArgDeclaration): string {
  return eventArg.isIndexed ? `${generateInputType({ useStructs: true }, eventArg.type)} | null` : 'null'
}

export function generateGetEventOverload(event: EventDeclaration): string {
  return `getEvent(nameOrSignatureOrTopic: '${event.name}'): EventFragment;`
}

function generateEventIdentifier(event: EventDeclaration, { includeArgTypes }: { includeArgTypes?: boolean } = {}) {
  if (includeArgTypes) {
    return getFullSignatureAsSymbolForEvent(event) + '_Event'
  } else {
    return event.name + 'Event'
  }
}

export const EVENT_METHOD_OVERRIDES = `
  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TEvent>>

  listeners<TEvent extends TypedEvent>(eventFilter?: TypedEventFilter<TEvent>): Array<TypedListener<TEvent>>
  listeners(eventName?: string): Array<Listener>
  removeAllListeners<TEvent extends TypedEvent>(eventFilter: TypedEventFilter<TEvent>): this
  removeAllListeners(eventName?: string): this
  off: OnEvent<this>
  on: OnEvent<this>
  once: OnEvent<this>
  removeListener: OnEvent<this>
`

export const EVENT_IMPORTS = ['TypedEventFilter', 'TypedEvent', 'TypedListener', 'OnEvent']
