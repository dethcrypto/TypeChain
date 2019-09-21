exports['DumbContract should snapshot generated code 1'] = `
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import { TransactionOverrides, TypedEventDescription, TypedFunctionDescription } from ".";

interface DumbContractInterface extends Interface {
  functions: {
    countupForEther: TypedFunctionDescription<{ encode([]: []): string }>;

    twoUnnamedArgs: TypedFunctionDescription<{
      encode([, , ret]: [BigNumberish, BigNumberish, BigNumberish]): string;
    }>;

    callWithBytes: TypedFunctionDescription<{ encode([byteParam]: [Arrayish]): string }>;

    countup: TypedFunctionDescription<{ encode([offset]: [BigNumberish]): string }>;

    callWithDynamicByteArray: TypedFunctionDescription<{
      encode([dynamicBytes]: [Arrayish]): string;
    }>;

    callWithArray: TypedFunctionDescription<{ encode([arrayParam]: [(BigNumberish)[]]): string }>;
  };

  events: {
    Deposit: TypedEventDescription<{
      encodeTopics([from, value]: [string | null, null]): string[];
    }>;
  };
}

export class DumbContract extends Contract {
  connect(signerOrProvider: Signer | Provider | string): DumbContract;
  attach(addressOrName: string): DumbContract;
  deployed(): Promise<DumbContract>;

  on(event: EventFilter | string, listener: Listener): DumbContract;
  once(event: EventFilter | string, listener: Listener): DumbContract;
  addListener(eventName: EventFilter | string, listener: Listener): DumbContract;
  removeAllListeners(eventName: EventFilter | string): DumbContract;
  removeListener(eventName: any, listener: Listener): DumbContract;

  interface: DumbContractInterface;

  functions: {
    returnSigned(offset: BigNumberish): Promise<BigNumber>;

    callWithBoolean(boolParam: boolean): Promise<boolean>;

    callWithArray2(arrayParam: (BigNumberish)[]): Promise<(BigNumber)[]>;

    testAddress(a: string): Promise<string>;

    testString(a: string): Promise<string>;

    callWithBooleanArray(boolArrayParam: (boolean)[]): Promise<(boolean)[]>;

    counterArray(arg0: BigNumberish): Promise<BigNumber>;

    returnAll(): Promise<{
      0: BigNumber;
      1: BigNumber;
    }>;

    counterWithOffset(offset: BigNumberish): Promise<BigNumber>;

    testVoidReturn(): Promise<void>;

    countupForEther(overrides?: TransactionOverrides): Promise<ContractTransaction>;

    twoUnnamedArgs(
      arg0: BigNumberish,
      arg1: BigNumberish,
      ret: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    callWithBytes(
      byteParam: Arrayish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    countup(offset: BigNumberish, overrides?: TransactionOverrides): Promise<ContractTransaction>;

    callWithDynamicByteArray(
      dynamicBytes: Arrayish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    callWithArray(
      arrayParam: (BigNumberish)[],
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    arrayParamLength(): Promise<BigNumber>;
    someAddress(): Promise<string>;
    counter(): Promise<BigNumber>;
    SOME_VALUE(): Promise<boolean>;
    dynamicByteArray(): Promise<string>;
    byteArray(): Promise<string>;
    returnSmallUint(): Promise<number>;
  };

  filters: {
    Deposit(from: string | null, value: null): EventFilter;
  };

  estimate: {
    countupForEther(): Promise<BigNumber>;

    twoUnnamedArgs(arg0: BigNumberish, arg1: BigNumberish, ret: BigNumberish): Promise<BigNumber>;

    callWithBytes(byteParam: Arrayish): Promise<BigNumber>;

    countup(offset: BigNumberish): Promise<BigNumber>;

    callWithDynamicByteArray(dynamicBytes: Arrayish): Promise<BigNumber>;

    callWithArray(arrayParam: (BigNumberish)[]): Promise<BigNumber>;
  };
}

`

exports['DumbContract should snapshot generated code 2'] = `
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";
import { BigNumberish } from "ethers/utils";

import { DumbContract } from "./DumbContract";

export class DumbContractFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }
  deploy(initialCounter: BigNumberish): Promise<DumbContract> {
    return super.deploy(initialCounter) as Promise<DumbContract>;
  }
  getDeployTransaction(initialCounter: BigNumberish): UnsignedTransaction {
    return super.getDeployTransaction(initialCounter);
  }
  attach(address: string): DumbContract {
    return super.attach(address) as DumbContract;
  }
  connect(signer: Signer): DumbContractFactory {
    return super.connect(signer) as DumbContractFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DumbContract {
    return new Contract(address, _abi, signerOrProvider) as DumbContract;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [],
    name: "arrayParamLength",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "countupForEther",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "someAddress",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "",
        type: "uint8",
      },
      {
        name: "",
        type: "uint8",
      },
      {
        name: "ret",
        type: "uint256",
      },
    ],
    name: "twoUnnamedArgs",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "offset",
        type: "int256",
      },
    ],
    name: "returnSigned",
    outputs: [
      {
        name: "",
        type: "int256",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "boolParam",
        type: "bool",
      },
    ],
    name: "callWithBoolean",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "arrayParam",
        type: "uint256[]",
      },
    ],
    name: "callWithArray2",
    outputs: [
      {
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "a",
        type: "address",
      },
    ],
    name: "testAddress",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "counter",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "a",
        type: "string",
      },
    ],
    name: "testString",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "byteParam",
        type: "bytes32",
      },
    ],
    name: "callWithBytes",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "boolArrayParam",
        type: "bool[]",
      },
    ],
    name: "callWithBooleanArray",
    outputs: [
      {
        name: "",
        type: "bool[]",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "counterArray",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "offset",
        type: "uint256",
      },
    ],
    name: "countup",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "returnAll",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "SOME_VALUE",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "offset",
        type: "uint256",
      },
    ],
    name: "counterWithOffset",
    outputs: [
      {
        name: "sum",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "dynamicByteArray",
    outputs: [
      {
        name: "",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "testVoidReturn",
    outputs: [],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "dynamicBytes",
        type: "bytes",
      },
    ],
    name: "callWithDynamicByteArray",
    outputs: [
      {
        name: "",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "byteArray",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "arrayParam",
        type: "uint256[]",
      },
    ],
    name: "callWithArray",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "returnSmallUint",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        name: "initialCounter",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051602080610def833981018060405281019080805190602001909291905050508060008190555033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610d648061008b6000396000f300608060405260043610610133576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806301989d4314610138578063144e61da1461016357806318e5f16b1461016d578063323e4406146101c457806338598070146102125780633bf9ed31146102535780633dfc64711461029a57806342f457901461035557806361bc221a146103d857806361cb5a01146104035780636813441f146104e55780637074ce581461053257806370a5ae35146105ed5780637916df081461062e57806385b1423e1461065b5780638dbf1f281461068d5780638e095299146106bc57806397bc19cf146106fd578063c15a2dcd1461078d578063d91a6347146107a4578063dad2718d14610886578063e65d5abe146108b9578063f1cb2e0214610933575b600080fd5b34801561014457600080fd5b5061014d610964565b6040518082815260200191505060405180910390f35b61016b61096a565b005b34801561017957600080fd5b506101826109f7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101fc600480360381019080803560ff169060200190929190803560ff16906020019092919080359060200190929190505050610a1d565b6040518082815260200191505060405180910390f35b34801561021e57600080fd5b5061023d60048036038101908080359060200190929190505050610a29565b6040518082815260200191505060405180910390f35b34801561025f57600080fd5b50610280600480360381019080803515159060200190929190505050610a33565b604051808215151515815260200191505060405180910390f35b3480156102a657600080fd5b506102fe60048036038101908080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050610a40565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b83811015610341578082015181840152602081019050610326565b505050509050019250505060405180910390f35b34801561036157600080fd5b50610396600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610a4a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156103e457600080fd5b506103ed610a54565b6040518082815260200191505060405180910390f35b34801561040f57600080fd5b5061046a600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610a5a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104aa57808201518184015260208101905061048f565b50505050905090810190601f1680156104d75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156104f157600080fd5b506105146004803603810190808035600019169060200190929190505050610a64565b60405180826000191660001916815260200191505060405180910390f35b34801561053e57600080fd5b5061059660048036038101908080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050610a7b565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105d95780820151818401526020810190506105be565b505050509050019250505060405180910390f35b3480156105f957600080fd5b5061061860048036038101908080359060200190929190505050610a88565b6040518082815260200191505060405180910390f35b34801561063a57600080fd5b5061065960048036038101908080359060200190929190505050610aab565b005b34801561066757600080fd5b50610670610aeb565b604051808381526020018281526020019250505060405180910390f35b34801561069957600080fd5b506106a2610b03565b604051808215151515815260200191505060405180910390f35b3480156106c857600080fd5b506106e760048036038101908080359060200190929190505050610b08565b6040518082815260200191505060405180910390f35b34801561070957600080fd5b50610712610b16565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610752578082015181840152602081019050610737565b50505050905090810190601f16801561077f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561079957600080fd5b506107a2610bb4565b005b3480156107b057600080fd5b5061080b600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610bb6565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561084b578082015181840152602081019050610830565b50505050905090810190601f1680156108785780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561089257600080fd5b5061089b610c71565b60405180826000191660001916815260200191505060405180910390f35b3480156108c557600080fd5b5061091d60048036038101908080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050610c77565b6040518082815260200191505060405180910390f35b34801561093f57600080fd5b50610948610c8a565b604051808260ff1660ff16815260200191505060405180910390f35b60035481565b346000808282540192505081905550600160005490806001815401808255809150509060018203906000526020600020016000909192909190915055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008190509392505050565b6000819050919050565b6000819150819050919050565b6060819050919050565b6000819050919050565b60005481565b6060819050919050565b600081600481600019169055506004549050919050565b6060819150819050919050565b600181815481101515610a9757fe5b906000526020600020016000915090505481565b8060008082825401925050819055506001600054908060018154018082558091505090600182039060005260206000200160009091929091909150555050565b600080600054610afb6005610b08565b915091509091565b600181565b600081600054019050919050565b60058054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bac5780601f10610b8157610100808354040283529160200191610bac565b820191906000526020600020905b815481529060010190602001808311610b8f57829003601f168201915b505050505081565b565b60608160059080519060200190610bce929190610c93565b5060058054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610c655780601f10610c3a57610100808354040283529160200191610c65565b820191906000526020600020905b815481529060010190602001808311610c4857829003601f168201915b50505050509050919050565b60045481565b6000815160038190555081519050919050565b60006012905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610cd457805160ff1916838001178555610d02565b82800160010185558215610d02579182015b82811115610d01578251825591602001919060010190610ce6565b5b509050610d0f9190610d13565b5090565b610d3591905b80821115610d31576000816000905550600101610d19565b5090565b905600a165627a7a72305820230f17286df593049e3ae42409610c7f7f8b8817f9d6ece3ba76a6ff5610f7700029";

`
