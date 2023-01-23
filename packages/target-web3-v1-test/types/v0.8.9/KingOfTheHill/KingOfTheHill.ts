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

export type HighestBidIncreased = ContractEventLog<{
  bid: [string, string];
  0: [string, string];
}>;

export interface KingOfTheHillConstructor {
  constructor(
    jsonInterface: AbiItem[],
    address?: string,
    options?: ContractOptions
  ): KingOfTheHill;
}

export interface KingOfTheHill extends BaseContract {
  clone(): KingOfTheHill;
  methods: {
    bid(): PayableTransactionObject<void>;

    highestBid(): NonPayableTransactionObject<{
      bidder: string;
      value: string;
      0: string;
      1: string;
    }>;

    withdraw(): NonPayableTransactionObject<void>;
  };
  events: {
    HighestBidIncreased(cb?: Callback<HighestBidIncreased>): EventEmitter;
    HighestBidIncreased(
      options?: EventOptions,
      cb?: Callback<HighestBidIncreased>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "HighestBidIncreased", cb: Callback<HighestBidIncreased>): void;
  once(
    event: "HighestBidIncreased",
    options: EventOptions,
    cb: Callback<HighestBidIncreased>
  ): void;
}
