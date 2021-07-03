import { values } from 'lodash'
import { Contract, FunctionDeclaration, FunctionDocumentation, isConstant, isConstantFn } from 'typechain'

import { codegenAllPossibleEvents, codegenEventsDeclarations } from './events'
import { codegenInputTypes, codegenOutputTypes } from './types'

export function codegenContract(contract: Contract) {
  return `
import { BigNumber } from "bignumber.js";

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
    c.constructor[0]
      ? `"new"(${codegenInputTypes(c.constructor[0].inputs)} meta?: Truffle.TransactionDetails): Promise<${
          c.name
        }Instance>;`
      : `"new"(meta?: Truffle.TransactionDetails): Promise<${c.name}Instance>;`
  }
}
`
}

function codegenContractInstanceInterface(c: Contract): string {
  return `
export interface ${c.name}Instance extends Truffle.ContractInstance {
  ${values(c.functions)
    .map((v) => v[0])
    .map(generateFunction)
    .join('\n')}
}
  `
}

function generateFunction(fn: FunctionDeclaration): string {
  if (isConstant(fn) || isConstantFn(fn)) {
    return generateConstantFunction(fn)
  }

  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${fn.name}: {
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

function generateConstantFunction(fn: FunctionDeclaration): string {
  return `
  ${generateFunctionDocumentation(fn.documentation)}
  ${fn.name}(${codegenInputTypes(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<${codegenOutputTypes(
    fn.outputs,
  )}>;
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
