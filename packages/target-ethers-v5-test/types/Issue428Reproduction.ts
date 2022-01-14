/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { BaseContract, Signer, utils } from "ethers";
import { EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface Issue428ReproductionInterface extends utils.Interface {
  contractName: string | "Issue428Reproduction";
  functions: {};

  events: {
    "Committed(address[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Committed"): EventFragment;
}

export type CommittedEvent = TypedEvent<[string[]], { whitelist: string[] }>;

export type CommittedEventFilter = TypedEventFilter<CommittedEvent>;

export interface Issue428Reproduction extends BaseContract {
  contractName: string | "Issue428Reproduction";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: Issue428ReproductionInterface;

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

  filters: {
    "Committed(address[])"(whitelist?: null): CommittedEventFilter;
    Committed(whitelist?: null): CommittedEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
