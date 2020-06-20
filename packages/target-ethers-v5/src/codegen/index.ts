import { values } from 'lodash'
import {
  AbiParameter,
  BytecodeWithLinkReferences,
  Contract,
  EventArgDeclaration,
  EventDeclaration,
  FunctionDeclaration,
} from 'typechain'
import { generateInputType, generateInputTypes } from './types'
import { codegenFunctions } from './functions'

export function codegenContractTypings(contract: Contract) {
  const contractImports: string[] = ['Contract', 'ContractTransaction']
  const allFunctions = values(contract.functions).map(codegenFunctions.bind(null, true)).join('')

  if (allFunctions.match(/\W Overrides(\W|$)/)) contractImports.push('Overrides')
  if (allFunctions.match(/\WPayableOverrides(\W|$)/)) contractImports.push('PayableOverrides')
  if (allFunctions.match(/\WCallOverrides(\W|$)/)) contractImports.push('CallOverrides')

  const template = `
  import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction } from 'ethers';
  import { ${contractImports.join(', ')} } from '@ethersproject/contracts';
  import { BytesLike } from '@ethersproject/bytes';
  import { Listener, Provider } from '@ethersproject/providers';
  import { FunctionFragment, EventFragment } from '@ethersproject/abi';

  interface ${contract.name}Interface extends ethers.utils.Interface {
    functions: {
      ${values(contract.functions)
        .map((v) => v[0])
        .map(generateInterfaceFunctionDescription)
        .join('\n')}
    };

    events: {
      ${values(contract.events)
        .map((v) => v[0])
        .map(generateInterfaceEventDescription)
        .join('\n')}
    };
  }

  export class ${contract.name} extends Contract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    on(event: EventFilter | string, listener: Listener): this;
    once(event: EventFilter | string, listener: Listener): this;
    addListener(eventName: EventFilter | string, listener: Listener): this;
    removeAllListeners(eventName: EventFilter | string): this;
    removeListener(eventName: any, listener: Listener): this;

    interface: ${contract.name}Interface;

    functions: {
      ${values(contract.functions).map(codegenFunctions.bind(null, true)).join('\n')}
    };

    ${values(contract.functions).map(codegenFunctions.bind(null, false)).join('\n')}

    filters: {
      ${values(contract.events)
        .map((v) => v[0])
        .map(generateEvents)
        .join('\n')}
    };

    estimateGas: {
      ${values(contract.functions)
        .map((v) => v[0])
        .map(generateEstimateFunction)
        .join('\n')}
    };

    populateTransaction: {
      ${values(contract.functions)
        .map((v) => v[0])
        .map(generatePopulateTransactionFunction)
        .join('\n')}
    };
  }`

  return template
}

export function codegenContractFactory(contract: Contract, abi: any, bytecode?: BytecodeWithLinkReferences): string {
  const constructorArgs =
    (contract.constructor && contract.constructor[0] ? generateInputTypes(contract.constructor[0].inputs) : '') +
    `overrides?: ${contract.constructor[0]?.stateMutability === 'payable' ? 'PayableOverrides' : 'Overrides'}`
  const constructorArgNamesWithoutOverrides =
    contract.constructor && contract.constructor[0] ? generateParamNames(contract.constructor[0].inputs) : ''
  const constructorArgNames = constructorArgNamesWithoutOverrides
    ? `${constructorArgNamesWithoutOverrides}, overrides`
    : 'overrides'
  if (!bytecode) return codegenAbstractContractFactory(contract, abi)

  // tsc with noUnusedLocals would complain about unused imports
  const ethersImports: string[] = ['Signer']
  if (constructorArgs.match(/\WBytesLike(\W|$)/)) ethersImports.push('BytesLike')
  if (constructorArgs.match(/\WBigNumberish(\W|$)/)) ethersImports.push('BigNumberish')

  const ethersContractImports: string[] = ['Contract', 'ContractFactory']
  if (constructorArgs.match(/\WPayableOverrides(\W|$)/)) {
    ethersContractImports.push('PayableOverrides')
  } else {
    ethersContractImports.push('Overrides')
  }

  return `
  import { ${ethersImports.join(', ')} } from "ethers";
  import { Provider, TransactionRequest } from '@ethersproject/providers';
  import { ${ethersContractImports.join(', ')} } from "@ethersproject/contracts";

  import { ${contract.name} as _${contract.name} } from "./${contract.name}";

  export class ${contract.name} extends _${contract.name} {
    constructor(addressOrName: string, signerOrProvider?: Signer | Provider | undefined) {
      super(addressOrName, _abi, signerOrProvider);
    }
  }

  export class ${contract.name}Factory extends ContractFactory {
    ${generateFactoryConstructor(contract, bytecode)}
    deploy(${constructorArgs}): Promise<${contract.name}> {
      return super.deploy(${constructorArgNames}) as Promise<${contract.name}>;
    }
    getDeployTransaction(${constructorArgs}): TransactionRequest {
      return super.getDeployTransaction(${constructorArgNames});
    };
    attach(address: string): ${contract.name} {
      return super.attach(address) as ${contract.name};
    }
    connect(signer: Signer): ${contract.name}Factory {
      return super.connect(signer) as ${contract.name}Factory;
    }
    static connect(address: string, signerOrProvider: Signer | Provider): ${contract.name} {
      return new Contract(address, _abi, signerOrProvider) as ${contract.name};
    }
  }

  const _abi = ${JSON.stringify(abi, null, 2)};

  const _bytecode = "${bytecode.bytecode}";

  ${generateLibraryAddressesInterface(contract, bytecode)}
  `
}

export function codegenAbstractContractFactory(contract: Contract, abi: any): string {
  return `
  import { Contract, Signer } from "ethers";
  import { Provider } from "ethers/providers";

  import { ${contract.name} } from "./${contract.name}";

  export class ${contract.name}Factory {
    static connect(address: string, signerOrProvider: Signer | Provider): ${contract.name} {
      return new Contract(address, _abi, signerOrProvider) as ${contract.name};
    }
  }

  const _abi = ${JSON.stringify(abi, null, 2)};
  `
}

function generateFactoryConstructor(contract: Contract, bytecode: BytecodeWithLinkReferences): string {
  if (!bytecode.linkReferences) {
    return `
    constructor(signer?: Signer) {
      super(_abi, _bytecode, signer);
    }
    `
  }

  const linkRefReplacements = bytecode.linkReferences.map((linkRef) => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    // We're using a double escape backslash, since the string will be pasted into generated code.
    const escapedLinkRefRegex = linkRef.reference.replace(/[.*+?^${}()|[\]\\]/g, '\\\\$&')
    const libraryKey = linkRef.name || linkRef.reference
    return `
      linkedBytecode = linkedBytecode.replace(
        new RegExp("${escapedLinkRefRegex}", "g"),
        linkLibraryAddresses["${libraryKey}"].replace(/^0x/, '').toLowerCase(),
      );`
  })

  return `
    constructor(linkLibraryAddresses: ${contract.name}LibraryAddresses, signer?: Signer) {
      super(_abi, ${contract.name}Factory.linkBytecode(linkLibraryAddresses), signer);
    }

    static linkBytecode(linkLibraryAddresses: ${contract.name}LibraryAddresses): string {
      let linkedBytecode = _bytecode;
      ${linkRefReplacements.join('\n')}

      return linkedBytecode;
    }
  `
}

function generateLibraryAddressesInterface(contract: Contract, bytecode: BytecodeWithLinkReferences): string {
  if (!bytecode.linkReferences) return ''

  const linkLibrariesKeys = bytecode.linkReferences.map(
    (linkRef) => `    ["${linkRef.name || linkRef.reference}"]: string;`,
  )
  return `
  export interface ${contract.name}LibraryAddresses {
    ${linkLibrariesKeys.join('\n')}
  };`
}

function generateEstimateFunction(fn: FunctionDeclaration): string {
  return `${fn.name}(${generateInputTypes(fn.inputs)}): Promise<BigNumber>;`
}

function generatePopulateTransactionFunction(fn: FunctionDeclaration): string {
  return `${fn.name}(${generateInputTypes(fn.inputs)}): Promise<PopulatedTransaction>;`
}

function generateInterfaceFunctionDescription(fn: FunctionDeclaration): string {
  return `'${generateFunctionSignature(fn)}': FunctionFragment;`
}

function generateFunctionSignature(fn: FunctionDeclaration): string {
  return `${fn.name}(${fn.inputs.map((input: any) => input.type.originalType).join(',')})`
}

function generateParamArrayTypes(params: Array<AbiParameter>): string {
  return `[${params.map((param) => generateInputType(param.type)).join(', ')}]`
}

function generateParamNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return params.map((param) => param.name).join(', ')
}

function generateParamArrayNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return `[${generateParamNames(params)}]`
}

function generateEvents(event: EventDeclaration) {
  return `
  ${event.name}(${generateEventTypes(event.inputs)}): EventFilter;
`
}

function generateInterfaceEventDescription(event: EventDeclaration): string {
  return `'${generateEventSignature(event)}': EventFragment;`
}

function generateEventSignature(event: EventDeclaration): string {
  return `${event.name}(${event.inputs.map((input: any) => input.type.originalType).join(',')})`
}

function generateEventTopicTypes(eventArgs: Array<EventArgDeclaration>): string {
  return `[${eventArgs.map(generateEventArgType).join(', ')}]`
}

function generateEventTypes(eventArgs: EventArgDeclaration[]) {
  if (eventArgs.length === 0) {
    return ''
  }
  return (
    eventArgs
      .map((arg) => {
        return `${arg.name}: ${generateEventArgType(arg)}`
      })
      .join(', ') + ', '
  )
}

function generateEventArgType(eventArg: EventArgDeclaration): string {
  return eventArg.isIndexed ? `${generateInputType(eventArg.type)} | null` : 'null'
}
