/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { AbiItem } from "web3-utils";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "../../types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface NAME12manglingConstructor {
  constructor(
    jsonInterface: AbiItem[],
    address?: string,
    options?: ContractOptions
  ): NAME12mangling;
}

export interface NAME12mangling extends BaseContract {
  clone(): NAME12mangling;
  methods: {
    provider(): NonPayableTransactionObject<boolean>;

    works(): NonPayableTransactionObject<boolean>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
