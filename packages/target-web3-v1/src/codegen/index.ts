import { Contract } from 'typechain'
import { codegenForEventsDeclarations, codegenForEvents, codegenForEventsOnceFns } from './events'
import { codegenForFunctions } from './functions'

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
