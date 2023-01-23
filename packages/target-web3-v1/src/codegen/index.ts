import { Contract } from 'typechain'

import { codegenForEvents, codegenForEventsDeclarations, codegenForEventsOnceFns } from './events'
import { codegenForFunctions } from './functions'

export function codegen(contract: Contract) {
  const typesPath = contract.path.length ? `${new Array(contract.path.length).fill('..').join('/')}/types` : './types'

  const template = `
  import type BN from "bn.js";
  import type { ContractOptions } from "web3-eth-contract";
  import type { EventLog } from "web3-core";
  import type { AbiItem } from 'web3-utils';
  import type { EventEmitter } from "events";
  import type { Callback, PayableTransactionObject, NonPayableTransactionObject, BlockType, ContractEventLog, BaseContract } from "${typesPath}";

  export interface EventOptions {
    filter?: object;
    fromBlock?: BlockType;
    topics?: string[];
  }

  ${codegenForEventsDeclarations(contract.events)}

  export interface ${contract.name}Constructor {
    constructor(jsonInterface: AbiItem[], address?: string, options?: ContractOptions): ${contract.name};
  }

  export interface ${contract.name} extends BaseContract {
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
