exports['Contract: DumbContract should snapshot generated code 1'] = `
/* tslint:disable */

/// <reference types="truffle-typings" />
import { BigNumber } from "bignumber.js";

export interface DefaultConstructorContract extends Truffle.Contract<DefaultConstructorInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<DefaultConstructorInstance>;
}

export interface DumbContractContract extends Truffle.Contract<DumbContractInstance> {
  "new"(
    _counter: number | BigNumber | string,
    meta?: Truffle.TransactionDetails,
  ): Promise<DumbContractInstance>;
}

export interface MigrationsContract extends Truffle.Contract<MigrationsInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<MigrationsInstance>;
}

export interface DefaultConstructorInstance extends Truffle.ContractInstance {
  counter(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>;
}

export interface DumbContractInstance extends Truffle.ContractInstance {
  counterArray(
    arg0: number | BigNumber | string,
    txDetails?: Truffle.TransactionDetails,
  ): Promise<BigNumber>;

  counterWithOffset(
    offset: number | BigNumber | string,
    txDetails?: Truffle.TransactionDetails,
  ): Promise<BigNumber>;

  returnAll(txDetails?: Truffle.TransactionDetails): Promise<[BigNumber, BigNumber]>;

  returnSigned(
    offset: number | BigNumber | string,
    txDetails?: Truffle.TransactionDetails,
  ): Promise<BigNumber>;

  callWithArray(
    arrayParam: (number | BigNumber | string)[],
    txDetails?: Truffle.TransactionDetails,
  ): Promise<(BigNumber)[]>;

  callWithBytes(
    byteParam: string | BigNumber,
    txDetails?: Truffle.TransactionDetails,
  ): Promise<string>;

  testAddress(a: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<string>;

  testString(a: string, txDetails?: Truffle.TransactionDetails): Promise<string>;

  countup: {
    (offset: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse
    >;
    call(
      offset: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<void>;
    sendTransaction(
      offset: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<string>;
    estimateGas(
      offset: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<number>;
  };

  countupWithReturn: {
    (offset: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse
    >;
    call(
      offset: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<BigNumber>;
    sendTransaction(
      offset: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<string>;
    estimateGas(
      offset: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<number>;
  };

  countupForEther: {
    (txDetails?: Truffle.TransactionDetails): Promise<Truffle.TransactionResponse>;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  twoUnnamedArgs: {
    (
      arg0: number | BigNumber | string,
      arg1: number | BigNumber | string,
      ret: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<Truffle.TransactionResponse>;
    call(
      arg0: number | BigNumber | string,
      arg1: number | BigNumber | string,
      ret: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<BigNumber>;
    sendTransaction(
      arg0: number | BigNumber | string,
      arg1: number | BigNumber | string,
      ret: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<string>;
    estimateGas(
      arg0: number | BigNumber | string,
      arg1: number | BigNumber | string,
      ret: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<number>;
  };

  arrayParamLength(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>;
  someAddress(txDetails?: Truffle.TransactionDetails): Promise<string>;
  counter(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>;
  SOME_VALUE(txDetails?: Truffle.TransactionDetails): Promise<boolean>;
  byteArray(txDetails?: Truffle.TransactionDetails): Promise<string>;
}

export interface MigrationsInstance extends Truffle.ContractInstance {
  setCompleted: {
    (completed: number | BigNumber | string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse
    >;
    call(
      completed: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<void>;
    sendTransaction(
      completed: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<string>;
    estimateGas(
      completed: number | BigNumber | string,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<number>;
  };

  upgrade: {
    (new_address: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse
    >;
    call(new_address: string | BigNumber, txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(
      new_address: string | BigNumber,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<string>;
    estimateGas(
      new_address: string | BigNumber,
      txDetails?: Truffle.TransactionDetails,
    ): Promise<number>;
  };

  last_completed_migration(txDetails?: Truffle.TransactionDetails): Promise<BigNumber>;
  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;
}

`

exports['Contract: DumbContract should snapshot generated code 2'] = `
/* tslint:disable */

/// <reference types="truffle-typings" />

import * as TruffleContracts from ".";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "DefaultConstructor"): TruffleContracts.DefaultConstructorContract;
      require(name: "DumbContract"): TruffleContracts.DumbContractContract;
      require(name: "Migrations"): TruffleContracts.MigrationsContract;
    }
  }
}

`
