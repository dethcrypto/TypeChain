/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface DataTypesView extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): DataTypesView;
  clone(): DataTypesView;
  methods: {
    view_address(): NonPayableTransactionObject<string>;

    view_bool(): NonPayableTransactionObject<boolean>;

    view_bytes(): NonPayableTransactionObject<string>;

    view_bytes1(): NonPayableTransactionObject<string>;

    view_enum(): NonPayableTransactionObject<string>;

    view_int256(): NonPayableTransactionObject<string>;

    view_int8(): NonPayableTransactionObject<string>;

    view_named(): NonPayableTransactionObject<{
      uint256_1: string;
      uint256_2: string;
      0: string;
      1: string;
    }>;

    view_stat_array(): NonPayableTransactionObject<string[]>;

    view_string(): NonPayableTransactionObject<string>;

    view_struct(): NonPayableTransactionObject<[string, string]>;

    view_tuple(): NonPayableTransactionObject<{
      0: string;
      1: string;
    }>;

    view_uint256(): NonPayableTransactionObject<string>;

    view_uint8(): NonPayableTransactionObject<string>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
