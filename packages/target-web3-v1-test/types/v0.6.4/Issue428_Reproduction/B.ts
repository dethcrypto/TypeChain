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

export type Committed_uint256 = ContractEventLog<{
  timelock: string;
  0: string;
}>;
export type Committed_address_array = ContractEventLog<{
  whitelist: string[];
  0: string[];
}>;

export interface BConstructor {
  constructor(
    jsonInterface: AbiItem[],
    address?: string,
    options?: ContractOptions
  ): B;
}

export interface B extends BaseContract {
  clone(): B;
  methods: {};
  events: {
    "Committed(uint256)"(cb?: Callback<Committed_uint256>): EventEmitter;
    "Committed(uint256)"(
      options?: EventOptions,
      cb?: Callback<Committed_uint256>
    ): EventEmitter;

    "Committed(address[])"(
      cb?: Callback<Committed_address_array>
    ): EventEmitter;
    "Committed(address[])"(
      options?: EventOptions,
      cb?: Callback<Committed_address_array>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
