import {
  Contract,
  AbiParameter,
  FunctionDeclaration,
  EventDeclaration,
  AbiOutputParameter,
  EvmType,
  TupleType,
  EvmOutputType,
} from 'typechain'
import { Dictionary } from 'ts-essentials'
import { values } from 'lodash'

export function codegen(contract: Contract) {
  const template = `
  import BN from "bn.js";
  import { ContractOptions } from "web3-eth-contract";
  import { EventLog } from "web3-core";
  import { EventEmitter } from "events";
  import { Callback, PayableTransactionObject, NonPayableTransactionObject, BlockType, ContractEventLog, BaseContract } from "./types";

  interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
  }

  ${codegenForEventsDeclarations(contract.events)}

  export interface ${contract.name} extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): ${contract.name};
    clone(): ${contract.name};
    methods: {
      ${codegenForFunctions(contract.functions)}
    };
    events: {
      ${codegenForEvents(contract.events)}
      allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
    };
    ${codegenForEventsOnceFns(contract.events)}
  }
  `

  return template
}

function codegenForFunctions(fns: Dictionary<FunctionDeclaration[]>): string {
  return values(fns)
    .map((v) => v[0])
    .map(generateFunction)
    .join('\n')
}

function generateFunction(fn: FunctionDeclaration): string {
  return `
  ${fn.name}(${generateInputTypes(fn.inputs)}): ${getTransactionObject(fn)}<${generateOutputTypes(fn.outputs)}>;
`
}

function getTransactionObject(fn: FunctionDeclaration): string {
  return fn.stateMutability === 'payable' ? 'PayableTransactionObject' : 'NonPayableTransactionObject'
}

function generateInputTypes(input: Array<AbiParameter>): string {
  if (input.length === 0) {
    return ''
  }
  return (
    input.map((input, index) => `${input.name || `arg${index}`}: ${generateInputType(input.type)}`).join(', ') + ', '
  )
}

function generateOutputTypes(outputs: Array<AbiOutputParameter>): string {
  if (outputs.length === 1) {
    return generateOutputType(outputs[0].type)
  } else {
    return `{
      ${outputs.map((t) => t.name && `${t.name}: ${generateOutputType(t.type)}, `).join('')}
      ${outputs.map((t, i) => `${i}: ${generateOutputType(t.type)}`).join(', ')}
      }`
  }
}

function codegenForEvents(events: Dictionary<EventDeclaration[]>): string {
  return values(events)
    .map((e) => e[0])
    .map(
      (event) => `
      ${event.name}(cb?: Callback<${event.name}>): EventEmitter;
      ${event.name}(options?: EventOptions, cb?: Callback<${event.name}>): EventEmitter;
      `,
    )
    .join('\n')
}

function codegenForEventsOnceFns(events: Dictionary<EventDeclaration[]>): string {
  return values(events)
    .map((e) => e[0])
    .map(
      (e) => `
    once(event: '${e.name}', cb: Callback<${e.name}>): void;
    once(event: '${e.name}', options: EventOptions, cb: Callback<${e.name}>): void;
    `,
    )
    .join('\n')
}

function codegenForEventsDeclarations(events: Dictionary<EventDeclaration[]>): string {
  return values(events)
    .map((e) => e[0])
    .map(generateEventDeclaration)
    .join('\n')
}

function generateEventDeclaration(event: EventDeclaration) {
  return `export type ${event.name} = ContractEventLog<${generateOutputTypes(event.inputs)}>`
}

function generateInputType(evmType: EvmType): string {
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
      return `(${generateInputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return generateTupleType(evmType, generateInputType)
  }
}

function generateOutputType(evmType: EvmOutputType): string {
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
      return `(${generateOutputType(evmType.itemType)})[]`
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    case 'tuple':
      return generateTupleType(evmType, generateOutputType)
  }
}

function generateTupleType(tuple: TupleType, generator: (evmType: EvmType) => string) {
  return '[' + tuple.components.map((component) => generator(component.type)).join(', ') + ']'
}
