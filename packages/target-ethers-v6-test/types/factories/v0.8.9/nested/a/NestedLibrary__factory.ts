/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface } from "ethers";
import type { ContractRunner } from "ethers/types/providers";
import type {
  NestedLibrary,
  NestedLibraryInterface,
} from "../../../../v0.8.9/nested/a/NestedLibrary";

const _abi = [
  {
    inputs: [],
    name: "getValue",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

export class NestedLibrary__factory {
  static readonly abi = _abi;
  static createInterface(): NestedLibraryInterface {
    return new Interface(_abi) as NestedLibraryInterface;
  }
  static connect(address: string, runner: ContractRunner): NestedLibrary {
    return new Contract(address, _abi, runner) as unknown as NestedLibrary;
  }
}
