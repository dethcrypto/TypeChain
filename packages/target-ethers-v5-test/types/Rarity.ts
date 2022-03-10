/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface RarityInterface extends utils.Interface {
  contractName: "Rarity";

  functions: {
    "adventure(uint256)": FunctionFragment;
    "adventurers_log(uint256)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "class(uint256)": FunctionFragment;
    "classes(uint256)": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "level(uint256)": FunctionFragment;
    "level_up(uint256)": FunctionFragment;
    "next_summoner()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "spend_xp(uint256,uint256)": FunctionFragment;
    "summon(uint256)": FunctionFragment;
    "summoner(uint256)": FunctionFragment;
    "tokenByIndex(uint256)": FunctionFragment;
    "tokenOfOwnerByIndex(address,uint256)": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "xp(uint256)": FunctionFragment;
    "xp_required(uint256)": FunctionFragment;
  };

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "leveled(address,uint256,uint256)": EventFragment;
    "summoned(address,uint256,uint256)": EventFragment;
  };

  getFunction(nameOrSignatureOrTopic: "adventure"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "adventurers_log"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "approve"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "balanceOf"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "class"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "classes"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "getApproved"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "isApprovedForAll"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "level"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "level_up"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "next_summoner"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "ownerOf"): FunctionFragment;
  getFunction(
    nameOrSignatureOrTopic: "safeTransferFrom(address,address,uint256)"
  ): FunctionFragment;
  getFunction(
    nameOrSignatureOrTopic: "safeTransferFrom(address,address,uint256,bytes)"
  ): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "setApprovalForAll"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "spend_xp"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "summon"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "summoner"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "tokenByIndex"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "tokenOfOwnerByIndex"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "tokenURI"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "totalSupply"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "transferFrom"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "xp"): FunctionFragment;
  getFunction(nameOrSignatureOrTopic: "xp_required"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "adventure",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "adventurers_log",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(functionFragment: "class", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "classes",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "level", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "level_up",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "next_summoner",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [string, string, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "spend_xp",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "summon",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "summoner",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenByIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenOfOwnerByIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "xp", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "xp_required",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "adventure", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "adventurers_log",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "class", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "classes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "level", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "level_up", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "next_summoner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "spend_xp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "summon", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "summoner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenOfOwnerByIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "xp", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "xp_required",
    data: BytesLike
  ): Result;

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "leveled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "summoned"): EventFragment;
}

export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  { owner: string; approved: string; tokenId: BigNumber }
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  { owner: string; operator: string; approved: boolean }
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  { from: string; to: string; tokenId: BigNumber }
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export type leveledEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { owner: string; level: BigNumber; summoner: BigNumber }
>;

export type leveledEventFilter = TypedEventFilter<leveledEvent>;

export type summonedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { owner: string; class: BigNumber; summoner: BigNumber }
>;

export type summonedEventFilter = TypedEventFilter<summonedEvent>;

export interface Rarity extends BaseContract {
  contractName: "Rarity";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RarityInterface;

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
    adventure(
      _summoner: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    adventurers_log(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    class(arg0: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    classes(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { description: string }>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    level(arg0: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    level_up(
      _summoner: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    next_summoner(overrides?: CallOverrides): Promise<[BigNumber]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    spend_xp(
      _summoner: BigNumberish,
      _xp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    summon(
      _class: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    summoner(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        _xp: BigNumber;
        _log: BigNumber;
        _class: BigNumber;
        _level: BigNumber;
      }
    >;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    tokenURI(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    xp(arg0: BigNumberish, overrides?: CallOverrides): Promise<[BigNumber]>;

    xp_required(
      curent_level: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { xp_to_next_level: BigNumber }>;
  };

  adventure(
    _summoner: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  adventurers_log(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  class(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  classes(id: BigNumberish, overrides?: CallOverrides): Promise<string>;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  level(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  level_up(
    _summoner: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  next_summoner(overrides?: CallOverrides): Promise<BigNumber>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  spend_xp(
    _summoner: BigNumberish,
    _xp: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  summon(
    _class: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  summoner(
    _summoner: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber] & {
      _xp: BigNumber;
      _log: BigNumber;
      _class: BigNumber;
      _level: BigNumber;
    }
  >;

  tokenByIndex(
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenOfOwnerByIndex(
    owner: string,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  tokenURI(_summoner: BigNumberish, overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  xp(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  xp_required(
    curent_level: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    adventure(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    adventurers_log(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    class(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    classes(id: BigNumberish, overrides?: CallOverrides): Promise<string>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    level(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    level_up(_summoner: BigNumberish, overrides?: CallOverrides): Promise<void>;

    next_summoner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    spend_xp(
      _summoner: BigNumberish,
      _xp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    summon(_class: BigNumberish, overrides?: CallOverrides): Promise<void>;

    summoner(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber] & {
        _xp: BigNumber;
        _log: BigNumber;
        _class: BigNumber;
        _level: BigNumber;
      }
    >;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    xp(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    xp_required(
      curent_level: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "Approval(address,address,uint256)"(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): ApprovalEventFilter;

    "ApprovalForAll(address,address,bool)"(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TransferEventFilter;

    "leveled(address,uint256,uint256)"(
      owner?: string | null,
      level?: null,
      summoner?: null
    ): leveledEventFilter;
    leveled(
      owner?: string | null,
      level?: null,
      summoner?: null
    ): leveledEventFilter;

    "summoned(address,uint256,uint256)"(
      owner?: string | null,
      _class?: null,
      summoner?: null
    ): summonedEventFilter;
    summoned(
      owner?: string | null,
      _class?: null,
      summoner?: null
    ): summonedEventFilter;
  };

  estimateGas: {
    adventure(
      _summoner: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    adventurers_log(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    class(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    classes(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    level(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    level_up(
      _summoner: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    next_summoner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    spend_xp(
      _summoner: BigNumberish,
      _xp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    summon(
      _class: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    summoner(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    xp(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    xp_required(
      curent_level: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    adventure(
      _summoner: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    adventurers_log(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    class(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    classes(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    level(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    level_up(
      _summoner: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    next_summoner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    spend_xp(
      _summoner: BigNumberish,
      _xp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    summon(
      _class: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    summoner(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenByIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenOfOwnerByIndex(
      owner: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      _summoner: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    xp(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    xp_required(
      curent_level: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
