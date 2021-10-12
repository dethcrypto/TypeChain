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

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type HighestBidIncreased = ContractEventLog<{
  bid: [string, string];
  0: [string, string];
}>;

export interface KingOfTheHill extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): KingOfTheHill;
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
