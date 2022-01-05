/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Demo,
  DemoInterface,
  Struct1Struct,
  Struct2Struct,
} from "../Demo";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "a",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "b",
            type: "uint256",
          },
        ],
        internalType: "struct Demo.Struct1",
        name: "input1",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "a",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "b",
            type: "uint256",
          },
        ],
        internalType: "struct Demo.Struct2[]",
        name: "input2",
        type: "tuple[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "purpose",
        type: "string",
      },
    ],
    name: "SetPurpose",
    type: "event",
  },
  {
    inputs: [],
    name: "purpose",
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
    inputs: [
      {
        internalType: "string",
        name: "newPurpose",
        type: "string",
      },
    ],
    name: "setPurpose",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526040518060400160405280601b81526020017f4275696c64696e6720556e73746f707061626c6520417070732121000000000081525060009080519060200190620000519291906200008d565b503480156200005f57600080fd5b5060405162000a7e38038062000a7e8339818101604052810190620000859190620002b4565b50506200048a565b8280546200009b906200037c565b90600052602060002090601f016020900481019282620000bf57600085556200010b565b82601f10620000da57805160ff19168380011785556200010b565b828001600101855582156200010b579182015b828111156200010a578251825591602001919060010190620000ed565b5b5090506200011a91906200011e565b5090565b5b80821115620001395760008160009055506001016200011f565b5090565b6000620001546200014e8462000343565b6200031a565b905080838252602082019050828560408602820111156200017a576200017962000450565b5b60005b85811015620001ae578162000193888262000244565b8452602084019350604083019250506001810190506200017d565b5050509392505050565b600082601f830112620001d057620001cf62000446565b5b8151620001e28482602086016200013d565b91505092915050565b6000604082840312156200020457620002036200044b565b5b6200021060406200031a565b9050600062000222848285016200029d565b600083015250602062000238848285016200029d565b60208301525092915050565b6000604082840312156200025d576200025c6200044b565b5b6200026960406200031a565b905060006200027b848285016200029d565b600083015250602062000291848285016200029d565b60208301525092915050565b600081519050620002ae8162000470565b92915050565b60008060608385031215620002ce57620002cd6200045a565b5b6000620002de85828601620001eb565b925050604083015167ffffffffffffffff81111562000302576200030162000455565b5b6200031085828601620001b8565b9150509250929050565b60006200032662000339565b9050620003348282620003b2565b919050565b6000604051905090565b600067ffffffffffffffff82111562000361576200036062000417565b5b602082029050602081019050919050565b6000819050919050565b600060028204905060018216806200039557607f821691505b60208210811415620003ac57620003ab620003e8565b5b50919050565b620003bd826200045f565b810181811067ffffffffffffffff82111715620003df57620003de62000417565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b6200047b8162000372565b81146200048757600080fd5b50565b6105e4806200049a6000396000f3fe6080604052600436106100295760003560e01c806370740aab1461002e578063eb68757f14610059575b600080fd5b34801561003a57600080fd5b50610043610075565b60405161005091906103ab565b60405180910390f35b610073600480360381019061006e919061026a565b610103565b005b60008054610082906104c8565b80601f01602080910402602001604051908101604052809291908181526020018280546100ae906104c8565b80156100fb5780601f106100d0576101008083540402835291602001916100fb565b820191906000526020600020905b8154815290600101906020018083116100de57829003601f168201915b505050505081565b8060009080519060200190610119929190610157565b507f6ea5d6383a120235c7728a9a6751672a8ac068e4ed34dcca2ee444182c1812de33600060405161014c92919061037b565b60405180910390a150565b828054610163906104c8565b90600052602060002090601f01602090048101928261018557600085556101cc565b82601f1061019e57805160ff19168380011785556101cc565b828001600101855582156101cc579182015b828111156101cb5782518255916020019190600101906101b0565b5b5090506101d991906101dd565b5090565b5b808211156101f65760008160009055506001016101de565b5090565b600061020d610208846103f2565b6103cd565b9050828152602081018484840111156102295761022861058e565b5b610234848285610486565b509392505050565b600082601f83011261025157610250610589565b5b81356102618482602086016101fa565b91505092915050565b6000602082840312156102805761027f610598565b5b600082013567ffffffffffffffff81111561029e5761029d610593565b5b6102aa8482850161023c565b91505092915050565b6102bc81610454565b82525050565b60006102cd82610438565b6102d78185610443565b93506102e7818560208601610495565b6102f08161059d565b840191505092915050565b60008154610308816104c8565b6103128186610443565b9450600182166000811461032d576001811461033f57610372565b60ff1983168652602086019350610372565b61034885610423565b60005b8381101561036a5781548189015260018201915060208101905061034b565b808801955050505b50505092915050565b600060408201905061039060008301856102b3565b81810360208301526103a281846102fb565b90509392505050565b600060208201905081810360008301526103c581846102c2565b905092915050565b60006103d76103e8565b90506103e382826104fa565b919050565b6000604051905090565b600067ffffffffffffffff82111561040d5761040c61055a565b5b6104168261059d565b9050602081019050919050565b60008190508160005260206000209050919050565b600081519050919050565b600082825260208201905092915050565b600061045f82610466565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b82818337600083830152505050565b60005b838110156104b3578082015181840152602081019050610498565b838111156104c2576000848401525b50505050565b600060028204905060018216806104e057607f821691505b602082108114156104f4576104f361052b565b5b50919050565b6105038261059d565b810181811067ffffffffffffffff821117156105225761052161055a565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f830116905091905056fea26469706673582212202e97e875ce69fa7b6c731bd46840c7545e5ce0c065e8a8e766feec03ef65017264736f6c63430008070033";

type DemoConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DemoConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Demo__factory extends ContractFactory {
  constructor(...args: DemoConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    input1: Struct1Struct,
    input2: Struct2Struct[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Demo> {
    return super.deploy(input1, input2, overrides || {}) as Promise<Demo>;
  }
  getDeployTransaction(
    input1: Struct1Struct,
    input2: Struct2Struct[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(input1, input2, overrides || {});
  }
  attach(address: string): Demo {
    return super.attach(address) as Demo;
  }
  connect(signer: Signer): Demo__factory {
    return super.connect(signer) as Demo__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DemoInterface {
    return new utils.Interface(_abi) as DemoInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Demo {
    return new Contract(address, _abi, signerOrProvider) as Demo;
  }
}
