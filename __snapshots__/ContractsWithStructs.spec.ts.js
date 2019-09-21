exports['ContractWithStructs should snapshot generated code 1'] = `
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import { TransactionOverrides, TypedEventDescription, TypedFunctionDescription } from ".";

interface ContractWithStructsInterface extends Interface {
  functions: {
    increaseCounter: TypedFunctionDescription<{ encode([by]: [BigNumberish]): string }>;

    setStuff: TypedFunctionDescription<{
      encode([_person, _thing]: [
        { height: BigNumberish; name: string; account: string },
        {
          counter: BigNumberish;
          mother: { height: BigNumberish; name: string; account: string };
          father: { height: BigNumberish; name: string; account: string };
        }
      ]): string;
    }>;
  };

  events: {};
}

export class ContractWithStructs extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ContractWithStructs;
  attach(addressOrName: string): ContractWithStructs;
  deployed(): Promise<ContractWithStructs>;

  on(event: EventFilter | string, listener: Listener): ContractWithStructs;
  once(event: EventFilter | string, listener: Listener): ContractWithStructs;
  addListener(eventName: EventFilter | string, listener: Listener): ContractWithStructs;
  removeAllListeners(eventName: EventFilter | string): ContractWithStructs;
  removeListener(eventName: any, listener: Listener): ContractWithStructs;

  interface: ContractWithStructsInterface;

  functions: {
    getCounter(offset: BigNumberish): Promise<BigNumber>;

    getStuff(): Promise<{
      _person: { height: BigNumber; name: string; account: string };
      _thing: {
        counter: BigNumber;
        mother: { height: BigNumber; name: string; account: string };
        father: { height: BigNumber; name: string; account: string };
      };
      0: { height: BigNumber; name: string; account: string };
      1: {
        counter: BigNumber;
        mother: { height: BigNumber; name: string; account: string };
        father: { height: BigNumber; name: string; account: string };
      };
    }>;

    owner(): Promise<{
      height: BigNumber;
      name: string;
      account: string;
      0: BigNumber;
      1: string;
      2: string;
    }>;

    thing(): Promise<{
      counter: BigNumber;
      mother: { height: BigNumber; name: string; account: string };
      father: { height: BigNumber; name: string; account: string };
      0: BigNumber;
      1: { height: BigNumber; name: string; account: string };
      2: { height: BigNumber; name: string; account: string };
    }>;

    increaseCounter(
      by: BigNumberish,
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;

    setStuff(
      _person: { height: BigNumberish; name: string; account: string },
      _thing: {
        counter: BigNumberish;
        mother: { height: BigNumberish; name: string; account: string };
        father: { height: BigNumberish; name: string; account: string };
      },
      overrides?: TransactionOverrides,
    ): Promise<ContractTransaction>;
  };

  filters: {};

  estimate: {
    increaseCounter(by: BigNumberish): Promise<BigNumber>;

    setStuff(
      _person: { height: BigNumberish; name: string; account: string },
      _thing: {
        counter: BigNumberish;
        mother: { height: BigNumberish; name: string; account: string };
        father: { height: BigNumberish; name: string; account: string };
      },
    ): Promise<BigNumber>;
  };
}

`

exports['ContractWithStructs should snapshot generated code 2'] = `
/* tslint:disable */

import { Contract, ContractFactory, Signer } from "ethers";
import { Provider } from "ethers/providers";
import { UnsignedTransaction } from "ethers/utils/transaction";

import { ContractWithStructs } from "./ContractWithStructs";

export class ContractWithStructsFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }
  deploy(): Promise<ContractWithStructs> {
    return super.deploy() as Promise<ContractWithStructs>;
  }
  getDeployTransaction(): UnsignedTransaction {
    return super.getDeployTransaction();
  }
  attach(address: string): ContractWithStructs {
    return super.attach(address) as ContractWithStructs;
  }
  connect(signer: Signer): ContractWithStructsFactory {
    return super.connect(signer) as ContractWithStructsFactory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ContractWithStructs {
    return new Contract(address, _abi, signerOrProvider) as ContractWithStructs;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [
      {
        name: "offset",
        type: "uint256",
      },
    ],
    name: "getCounter",
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
    inputs: [],
    name: "getStuff",
    outputs: [
      {
        components: [
          {
            name: "height",
            type: "uint256",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "account",
            type: "address",
          },
        ],
        name: "_person",
        type: "tuple",
      },
      {
        components: [
          {
            name: "counter",
            type: "uint256",
          },
          {
            components: [
              {
                name: "height",
                type: "uint256",
              },
              {
                name: "name",
                type: "string",
              },
              {
                name: "account",
                type: "address",
              },
            ],
            name: "mother",
            type: "tuple",
          },
          {
            components: [
              {
                name: "height",
                type: "uint256",
              },
              {
                name: "name",
                type: "string",
              },
              {
                name: "account",
                type: "address",
              },
            ],
            name: "father",
            type: "tuple",
          },
        ],
        name: "_thing",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getCounter",
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
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "height",
        type: "uint256",
      },
      {
        name: "name",
        type: "string",
      },
      {
        name: "account",
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
        name: "by",
        type: "uint256",
      },
    ],
    name: "increaseCounter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "increaseCounter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "thing",
    outputs: [
      {
        name: "counter",
        type: "uint256",
      },
      {
        components: [
          {
            name: "height",
            type: "uint256",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "account",
            type: "address",
          },
        ],
        name: "mother",
        type: "tuple",
      },
      {
        components: [
          {
            name: "height",
            type: "uint256",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "account",
            type: "address",
          },
        ],
        name: "father",
        type: "tuple",
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
        components: [
          {
            name: "height",
            type: "uint256",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "account",
            type: "address",
          },
        ],
        name: "_person",
        type: "tuple",
      },
      {
        components: [
          {
            name: "counter",
            type: "uint256",
          },
          {
            components: [
              {
                name: "height",
                type: "uint256",
              },
              {
                name: "name",
                type: "string",
              },
              {
                name: "account",
                type: "address",
              },
            ],
            name: "mother",
            type: "tuple",
          },
          {
            components: [
              {
                name: "height",
                type: "uint256",
              },
              {
                name: "name",
                type: "string",
              },
              {
                name: "account",
                type: "address",
              },
            ],
            name: "father",
            type: "tuple",
          },
        ],
        name: "_thing",
        type: "tuple",
      },
    ],
    name: "setStuff",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50606060405190810160405280600c81526020016040805190810160405280600481526020017f66726564000000000000000000000000000000000000000000000000000000008152508152602001600073ffffffffffffffffffffffffffffffffffffffff1681525060008082015181600001556020820151816001019080519060200190620000a4929190620000f5565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550905050620001a4565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200013857805160ff191683800117855562000169565b8280016001018555821562000169579182015b82811115620001685782518255916020019190600101906200014b565b5b5090506200017891906200017c565b5090565b620001a191905b808211156200019d57600081600090555060010162000183565b5090565b90565b61115e80620001b46000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063214aed451461009357806387405758146100d05780638ada066e146100fc5780638da5cb5b146101275780639e80c07414610154578063b49004e91461017d578063c55e90fe14610194578063cd3f7619146101c1575b600080fd5b34801561009f57600080fd5b506100ba60048036036100b59190810190610dd0565b6101ea565b6040516100c79190610f7b565b60405180910390f35b3480156100dc57600080fd5b506100e56101fb565b6040516100f3929190610f44565b60405180910390f35b34801561010857600080fd5b5061011161056f565b60405161011e9190610f7b565b60405180910390f35b34801561013357600080fd5b5061013c61057c565b60405161014b93929190610f96565b60405180910390f35b34801561016057600080fd5b5061017b60048036036101769190810190610dd0565b61064c565b005b34801561018957600080fd5b50610192610662565b005b3480156101a057600080fd5b506101a9610678565b6040516101b893929190610fd4565b60405180910390f35b3480156101cd57600080fd5b506101e860048036036101e39190810190610d64565b6108aa565b005b600081600360000154019050919050565b610203610a23565b61020b610a5b565b60006003816060604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102bf5780601f10610294576101008083540402835291602001916102bf565b820191906000526020600020905b8154815290600101906020018083116102a257829003601f168201915b505050505081526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815250509150806060604051908101604052908160008201548152602001600182016060604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103eb5780601f106103c0576101008083540402835291602001916103eb565b820191906000526020600020905b8154815290600101906020018083116103ce57829003601f168201915b505050505081526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815250508152602001600482016060604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105025780601f106104d757610100808354040283529160200191610502565b820191906000526020600020905b8154815290600101906020018083116104e557829003601f168201915b505050505081526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050815250509050915091509091565b6000600360000154905090565b6000806000015490806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561061c5780601f106105f15761010080835404028352916020019161061c565b820191906000526020600020905b8154815290600101906020018083116105ff57829003601f168201915b5050505050908060020160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905083565b8060036000016000828254019250508190555050565b6001600360000160008282540192505081905550565b6003806000015490806001016060604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107335780601f1061070857610100808354040283529160200191610733565b820191906000526020600020905b81548152906001019060200180831161071657829003601f168201915b505050505081526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152505090806004016060604051908101604052908160008201548152602001600182018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108465780601f1061081b57610100808354040283529160200191610846565b820191906000526020600020905b81548152906001019060200180831161082957829003601f168201915b505050505081526020016002820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681525050905083565b81600080820151816000015560208201518160010190805190602001906108d2929190610a89565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555090505080600360008201518160000155602082015181600101600082015181600001556020820151816001019080519060200190610959929190610a89565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050506040820151816004016000820151816000015560208201518160010190805190602001906109d2929190610a89565b5060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050509050505050565b6060604051908101604052806000815260200160608152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b60e06040519081016040528060008152602001610a76610b09565b8152602001610a83610b09565b81525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610aca57805160ff1916838001178555610af8565b82800160010185558215610af8579182015b82811115610af7578251825591602001919060010190610adc565b5b509050610b059190610b41565b5090565b6060604051908101604052806000815260200160608152602001600073ffffffffffffffffffffffffffffffffffffffff1681525090565b610b6391905b80821115610b5f576000816000905550600101610b47565b5090565b90565b6000610b7282356110a7565b905092915050565b600082601f8301121515610b8d57600080fd5b8135610ba0610b9b82611046565b611019565b91508082526020830160208301858383011115610bbc57600080fd5b610bc78382846110d1565b50505092915050565b600060608284031215610be257600080fd5b610bec6060611019565b90506000610bfc84828501610d50565b600083015250602082013567ffffffffffffffff811115610c1c57600080fd5b610c2884828501610b7a565b6020830152506040610c3c84828501610b66565b60408301525092915050565b600060608284031215610c5a57600080fd5b610c646060611019565b90506000610c7484828501610d50565b600083015250602082013567ffffffffffffffff811115610c9457600080fd5b610ca084828501610b7a565b6020830152506040610cb484828501610b66565b60408301525092915050565b600060608284031215610cd257600080fd5b610cdc6060611019565b90506000610cec84828501610d50565b600083015250602082013567ffffffffffffffff811115610d0c57600080fd5b610d1884828501610bd0565b602083015250604082013567ffffffffffffffff811115610d3857600080fd5b610d4484828501610bd0565b60408301525092915050565b6000610d5c82356110c7565b905092915050565b60008060408385031215610d7757600080fd5b600083013567ffffffffffffffff811115610d9157600080fd5b610d9d85828601610c48565b925050602083013567ffffffffffffffff811115610dba57600080fd5b610dc685828601610cc0565b9150509250929050565b600060208284031215610de257600080fd5b6000610df084828501610d50565b91505092915050565b610e028161107d565b82525050565b6000610e1382611072565b808452610e278160208601602086016110e0565b610e3081611113565b602085010191505092915050565b6000606083016000830151610e566000860182610f35565b5060208301518482036020860152610e6e8282610e08565b9150506040830151610e836040860182610df9565b508091505092915050565b6000606083016000830151610ea66000860182610f35565b5060208301518482036020860152610ebe8282610e08565b9150506040830151610ed36040860182610df9565b508091505092915050565b6000606083016000830151610ef66000860182610f35565b5060208301518482036020860152610f0e8282610e8e565b91505060408301518482036040860152610f288282610e8e565b9150508091505092915050565b610f3e8161109d565b82525050565b60006040820190508181036000830152610f5e8185610e3e565b90508181036020830152610f728184610ede565b90509392505050565b6000602082019050610f906000830184610f35565b92915050565b6000606082019050610fab6000830186610f35565b8181036020830152610fbd8185610e08565b9050610fcc6040830184610df9565b949350505050565b6000606082019050610fe96000830186610f35565b8181036020830152610ffb8185610e8e565b9050818103604083015261100f8184610e8e565b9050949350505050565b6000604051905081810181811067ffffffffffffffff8211171561103c57600080fd5b8060405250919050565b600067ffffffffffffffff82111561105d57600080fd5b601f19601f8301169050602081019050919050565b600081519050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b838110156110fe5780820151818401526020810190506110e3565b8381111561110d576000848401525b50505050565b6000601f19601f83011690509190505600a265627a7a723058202d6e70e3536ecdc2237e1e371ef2bbb0271f6749d1ecaeaa290cec6aa29b8bcf6c6578706572696d656e74616cf50037";

`
