/* eslint-disable import/no-extraneous-dependencies */
import {
  createPositionalIdentifier,
  EventArgDeclaration,
  EventDeclaration,
  getFullSignatureAsSymbolForEvent,
} from 'typechain'

import { generateInputType, generateOutputComplexTypeAsTuple, generateOutputComplexTypesAsObject } from './types'

export function generateEventFilters(events: EventDeclaration[]) {
  if (events.length === 1) {
    const event = events[0]
    const eventIdentifier = generateEventIdentifier(event, {
      includeArgTypes: false,
    })
    const typedEventFilter = `TypedContractEvent<${eventIdentifier}.Tuple, ${eventIdentifier}.Object>`

    return `
      '${generateEventSignature(event)}': ${typedEventFilter};
      ${event.name}: ${typedEventFilter};
    `
  } else {
    return events
      .map((event) => {
        const eventIdentifier = generateEventIdentifier(event, {
          includeArgTypes: true,
        })
        const typedEventFilter = `TypedContractEvent<${eventIdentifier}.Tuple, ${eventIdentifier}.Object>`
        return `'${generateEventSignature(event)}': ${typedEventFilter};`
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
  const tupleOutput = generateOutputComplexTypeAsTuple(components, {
    useStructs: true,
    includeLabelsInTupleTypes: true,
  })
  const objectOutput = generateOutputComplexTypesAsObject(components, { useStructs: true }) || '{}'

  const identifier = generateEventIdentifier(event, { includeArgTypes })

  return `
    export namespace ${identifier} {
      export interface Object ${objectOutput};
      export type Tuple = ${tupleOutput};
      export type Event = TypedContractEvent<Tuple, Object>
      export type Filter = TypedDeferredTopicFilter<Event>
    }

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

export function generateEventNameOrSignature(event: EventDeclaration, useSignature: boolean) {
  return useSignature ? generateEventSignature(event) : event.name
}

// export function generateGetEventForInterface(event: EventDeclaration, useSignature: boolean): string {
//   return `getEvent(nameOrSignatureOrTopic: '${
//     useSignature ? generateEventSignature(event) : event.name
//   }'): EventFragment;`
// }

export function generateGetEventForInterface(args: string[]): string {
  if (args.length === 0) return ''

  return `getEvent(nameOrSignatureOrTopic: ${args.map((s) => `"${s}"`).join(' | ')}): EventFragment;`
}

export function generateGetEventForContract(event: EventDeclaration, useSignature: boolean): string {
  const eventIdentifier = generateEventIdentifier(event, {
    includeArgTypes: useSignature,
  })
  const typedContractEvent = `TypedContractEvent<${eventIdentifier}.Tuple, ${eventIdentifier}.Object>`
  return `getEvent(key: '${useSignature ? generateEventSignature(event) : event.name}'): ${typedContractEvent};`
}

function generateEventIdentifier(event: EventDeclaration, { includeArgTypes }: { includeArgTypes?: boolean } = {}) {
  if (includeArgTypes) {
    return getFullSignatureAsSymbolForEvent(event) + '_Event'
  } else {
    return event.name + 'Event'
  }
}

export const EVENT_METHOD_OVERRIDES = `
  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEventLog<TCEvent>>>
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>
  on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>
  
  once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>
  once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>
  removeAllListeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<this>
`

export const EVENT_IMPORTS = ['TypedContractEvent', 'TypedDeferredTopicFilter', 'TypedEventLog', 'TypedListener']
