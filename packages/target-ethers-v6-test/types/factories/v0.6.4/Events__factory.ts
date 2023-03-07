/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, ContractRunner } from "ethers";
import type { Events, EventsInterface } from "../../v0.6.4/Events";

const _abi = [
  {
    anonymous: true,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "value1",
        type: "uint256",
      },
    ],
    name: "AnonEvent1",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "value1",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value2",
        type: "uint256",
      },
    ],
    name: "Event1",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "Event2",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bool",
        name: "value1",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value2",
        type: "uint256",
      },
    ],
    name: "Event3",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "value1",
        type: "uint256",
      },
    ],
    name: "Event3",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "index",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
        ],
        indexed: false,
        internalType: "struct Events.EventData",
        name: "data",
        type: "tuple",
      },
    ],
    name: "Event4",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "NoArgsEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    name: "UpdateFrequencySet",
    type: "event",
  },
  {
    inputs: [],
    name: "emit_anon1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emit_event1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emit_event2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emit_event3",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emit_event3_overloaded",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emit_event4",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class Events__factory {
  static readonly abi = _abi;
  static createInterface(): EventsInterface {
    return new Interface(_abi) as EventsInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Events {
    return new Contract(address, _abi, runner) as unknown as Events;
  }
}
