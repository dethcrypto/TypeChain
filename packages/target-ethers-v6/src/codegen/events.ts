/* eslint-disable import/no-extraneous-dependencies */
import {
  createPositionalIdentifier,
  EventArgDeclaration,
  EventDeclaration,
  getFullSignatureAsSymbolForEvent,
} from 'typechain'

import {
  generateInputComplexTypeAsTuple,
  generateInputType,
  generateOutputComplexTypeAsTuple,
  generateOutputComplexTypesAsObject,
} from './types'

export function generateEventFilters(events: EventDeclaration[]) {
  if (events.length === 1) {
    const event = events[0]
    const typedEventFilter = generateTypedContractEvent(event, false)
    return `
      '${generateEventSignature(event)}': ${typedEventFilter};
      ${event.name}: ${typedEventFilter};
    `
  } else {
    return events
      .map((event) => `'${generateEventSignature(event)}': ${generateTypedContractEvent(event, true)};`)
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
  const inputTuple = generateInputComplexTypeAsTuple(components, {
    useStructs: true,
    includeLabelsInTupleTypes: true,
  })
  const outputTuple = generateOutputComplexTypeAsTuple(components, {
    useStructs: true,
    includeLabelsInTupleTypes: true,
  })
  const outputObject = generateOutputComplexTypesAsObject(components, { useStructs: true }) || '{}'

  const identifier = generateEventIdentifier(event, { includeArgTypes })

  return `
    export namespace ${identifier} {
      export type InputTuple = ${inputTuple};
      export type OutputTuple = ${outputTuple};
      export interface OutputObject ${outputObject};
      export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>
      export type Filter = TypedDeferredTopicFilter<Event>
      export type Log = TypedEventLog<Event>
      export type LogDescription = TypedLogDescription<Event>
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

export function generateTypedContractEvent(event: EventDeclaration, useSignature: boolean): string {
  const eventIdentifier = generateEventIdentifier(event, {
    includeArgTypes: useSignature,
  })
  return `TypedContractEvent<${eventIdentifier}.InputTuple, ${eventIdentifier}.OutputTuple, ${eventIdentifier}.OutputObject>`
}

export function generateGetEventForContract(event: EventDeclaration, useSignature: boolean): string {
  const typedContractEvent = generateTypedContractEvent(event, useSignature)
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
  removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>
`

export const EVENT_IMPORTS = [
  'TypedContractEvent',
  'TypedDeferredTopicFilter',
  'TypedEventLog',
  'TypedLogDescription',
  'TypedListener',
]
