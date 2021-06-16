/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
/*
  These types correspond to solidity contract code from source file:
  ../../contracts/compiled/PayableFactory.abi
*/

import { Contract, Signer } from "ethers";
import { Provider } from "ethers/providers";

import { DataTypesView } from "../DataTypesView";

export class DataTypesView__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DataTypesView {
    return new Contract(address, _abi, signerOrProvider) as DataTypesView;
  }
}

const _abi = [
  {
    inputs: [],
    name: "view_address",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_bool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_bytes",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_bytes1",
    outputs: [
      {
        internalType: "bytes1",
        name: "",
        type: "bytes1",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_enum",
    outputs: [
      {
        internalType: "enum DataTypesView.Enum1",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_int256",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_int8",
    outputs: [
      {
        internalType: "int8",
        name: "",
        type: "int8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_named",
    outputs: [
      {
        internalType: "uint256",
        name: "uint256_1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "uint256_2",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_stat_array",
    outputs: [
      {
        internalType: "uint8[3]",
        name: "",
        type: "uint8[3]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_string",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_struct",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "uint256_0",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "uint256_1",
            type: "uint256",
          },
        ],
        internalType: "struct DataTypesView.Struct1",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_tuple",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_uint256",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "view_uint8",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
