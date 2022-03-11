/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface PayableInterface extends utils.Interface {
  contractName: "Payable";

  functions: {
    "non_payable_func()": FunctionFragment;
    "payable_func()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "non_payable_func" | "payable_func"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "non_payable_func",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "payable_func",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "non_payable_func",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "payable_func",
    data: BytesLike
  ): Result;

  events: {};
}

export interface Payable extends BaseContract {
  contractName: "Payable";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PayableInterface;

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
    non_payable_func(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    payable_func(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  non_payable_func(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  payable_func(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    non_payable_func(overrides?: CallOverrides): Promise<void>;

    payable_func(overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    non_payable_func(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    payable_func(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    non_payable_func(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    payable_func(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
