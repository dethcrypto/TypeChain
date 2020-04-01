/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  TransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract
} from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface DataTypesPure extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): DataTypesPure;
  clone(): DataTypesPure;
  methods: {
    pure_address(): TransactionObject<string>;

    pure_bool(): TransactionObject<boolean>;

    pure_bytes(): TransactionObject<string>;

    pure_bytes1(): TransactionObject<string>;

    pure_enum(): TransactionObject<string>;

    pure_int256(): TransactionObject<string>;

    pure_int8(): TransactionObject<string>;

    pure_stat_array(): TransactionObject<string[]>;

    pure_string(): TransactionObject<string>;

    pure_struct(): TransactionObject<{ uint256_0: string; uint256_1: string }>;

    pure_tuple(): TransactionObject<{
      0: string;
      1: string;
    }>;

    pure_uint256(): TransactionObject<string>;

    pure_uint8(): TransactionObject<string>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}