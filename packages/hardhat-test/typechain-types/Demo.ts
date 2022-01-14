/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { BaseContract, BigNumber, BigNumberish, Signer, utils } from "ethers";

import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace Demo {
  export type Struct1Struct = { a: BigNumberish; b: BigNumberish };

  export type Struct1StructOutput = [BigNumber, BigNumber] & {
    a: BigNumber;
    b: BigNumber;
  };

  export type Struct2Struct = { a: BigNumberish; b: BigNumberish };

  export type Struct2StructOutput = [BigNumber, BigNumber] & {
    a: BigNumber;
    b: BigNumber;
  };
}

export interface DemoInterface extends utils.Interface {
  contractName: string | "Demo";
  functions: {};

  events: {};
}

export interface Demo extends BaseContract {
  contractName: string | "Demo";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DemoInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {};

  callStatic: {};

  filters: {};

  estimateGas: {};

  populateTransaction: {};
}
