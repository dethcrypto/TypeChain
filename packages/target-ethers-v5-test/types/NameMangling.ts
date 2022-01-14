/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface NameManglingInterface extends utils.Interface {
  contractName: string | "NameMangling";
  functions: {
    "provider()": FunctionFragment;
    "works()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "provider", values?: undefined): string;
  encodeFunctionData(functionFragment: "works", values?: undefined): string;

  decodeFunctionResult(functionFragment: "provider", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "works", data: BytesLike): Result;

  events: {};
}

export interface NameMangling extends BaseContract {
  contractName: string | "NameMangling";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: NameManglingInterface;

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

  functions: {
    provider(overrides?: CallOverrides): Promise<[boolean]>;

    works(overrides?: CallOverrides): Promise<[boolean]>;
  };

  works(overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    provider(overrides?: CallOverrides): Promise<boolean>;

    works(overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {};

  estimateGas: {
    provider(overrides?: CallOverrides): Promise<BigNumber>;

    works(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    provider(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    works(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
