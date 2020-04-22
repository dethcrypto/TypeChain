import {
  Contract,
  FunctionDeclaration,
  FunctionDocumentation,
  isConstant,
  isConstantFn,
  getSignatureForFn,
} from 'typechain'
import { values } from 'lodash'
import { codegenInputTypes, codegenOutputTypes } from './types'
import { codegenEventsDeclarations, codegenAllPossibleEvents } from './events'

export function codegenContract(contract: Contract) {
  return `
import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract"

${codegenContractInterface(contract)}

${codegenEventsDeclarations(contract)}
${codegenAllPossibleEvents(contract)}

${codegenContractInstanceInterface(contract)}
  `
}

function codegenContractInterface(c: Contract): string {
  return `
export interface ${c.name}Contract extends Truffle.Contract<${c.name}Instance> {
  ${
    c.constructor && c.constructor[0]
      ? `"new"(${codegenInputTypes(c.constructor[0].inputs)} meta?: Truffle.TransactionDetails): Promise<${
          c.name
        }Instance>;`
      : `"new"(meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
  }
}
`
}

function codegenContractInstanceInterface(c: Contract): string {
  const functionsCode = values(c.functions)
    .filter((v) => v.length === 1) // no overloaded functions
    .map((v) => v[0])
    .map((fn) => generateFunction(fn))
    .join('\n')

  return `
export interface ${c.name}Instance extends Truffle.ContractInstance {
  ${functionsCode}

  methods: {
    ${functionsCode}
    ${values(c.functions)
      .filter((v) => v.length > 1) // has overloaded functions
      .map(generateOverloadedFunctions)
      .join('\n')}
  }

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
      event: string,
      options: PastEventOptions,
      callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
      event: string,
      callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
  `
}

function generateFunction(fn: FunctionDeclaration, overloadedName?: string): string {
  if (isConstant(fn) || isConstantFn(fn)) {
    return generateConstantFunction(fn, overloadedName)
  }

  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}: {
    (${codegenInputTypes(
      fn.inputs,
    )} txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse<AllEvents>>;
  call(${codegenInputTypes(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<${codegenOutputTypes(
    fn.outputs,
  )}>;
  sendTransaction(${codegenInputTypes(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<string>;
  estimateGas(${codegenInputTypes(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<number>;
  }
`
}

function generateConstantFunction(fn: FunctionDeclaration, overloadedName?: string): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${overloadedName ?? fn.name}(${codegenInputTypes(
    fn.inputs,
  )} txDetails?: Truffle.TransactionDetails): Promise<${codegenOutputTypes(fn.outputs)}>;
`
}

function generateFunctionDocumentation(doc?: FunctionDocumentation): string {
  if (!doc) return ''

  let docString = '/**'
  if (doc.details) docString += `\n * ${doc.details}`
  if (doc.notice) docString += `\n * ${doc.notice}`

  const params = Object.entries(doc.params || {})
  if (params.length) {
    params.forEach(([key, value]) => {
      docString += `\n * @param ${key} ${value}`
    })
  }

  if (doc.return) docString += `\n * @returns ${doc.return}`

  docString += '\n */'

  return docString
}

export function generateOverloadedFunctions(fns: FunctionDeclaration[]): string {
  return fns.map((fn) => generateFunction(fn, `"${getSignatureForFn(fn)}"`)).join('\n')
}
