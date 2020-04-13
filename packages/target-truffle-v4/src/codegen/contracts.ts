import { Contract, FunctionDeclaration, isConstant, isConstantFn } from 'typechain'
import { values } from 'lodash'
import { codegenInputTypes, codegenOutputTypes } from './types'
import { codegenEventsDeclarations, codegenAllPossibleEvents } from './events'

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
  ${fn.name}(${codegenInputTypes(fn.inputs)} txDetails?: Truffle.TransactionDetails): Promise<${codegenOutputTypes(
    fn.outputs,
  )}>;
`
}
