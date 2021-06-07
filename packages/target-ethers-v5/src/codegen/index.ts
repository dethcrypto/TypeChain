import { values } from 'lodash'
import {
  AbiParameter,
  BytecodeWithLinkReferences,
  CodegenConfig,
  Contract,
  EventArgDeclaration,
  EventDeclaration,
  FunctionDeclaration,
} from 'typechain'
import { FACTORY_POSTFIX } from '../common'
import { codegenFunctions } from './functions'
import { reservedKeywords } from './reserved-keywords'
import {
  generateInputType,
  generateInputTypes,
  generateOutputComplexTypeAsArray,
  generateOutputComplexTypesAsObject,
} from './types'

export function codegenContractTypings(contract: Contract, codegenConfig: CodegenConfig) {
  const contractImports: string[] = ['BaseContract', 'ContractTransaction']
  const allFunctions = values(contract.functions)
    .map(
      (fn) =>
        codegenFunctions({ returnResultObject: true, codegenConfig }, fn) +
        codegenFunctions({ isStaticCall: true, codegenConfig }, fn),
    )
    .join('')

  const optionalContractImports = ['Overrides', 'PayableOverrides', 'CallOverrides']
  optionalContractImports.forEach((importName) => pushImportIfUsed(importName, allFunctions, contractImports))

  const template = `
  import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction, ${contractImports.join(
    ', ',
  )} } from 'ethers';
  import { BytesLike } from '@ethersproject/bytes';
  import { Listener, Provider } from '@ethersproject/providers';
  import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
  import { TypedEventFilter, TypedEvent, TypedListener } from './commons';

  interface ${contract.name}Interface extends ethers.utils.Interface {
    functions: {
      ${values(contract.functions)
        .map((v) => v[0])
        .map(generateInterfaceFunctionDescription)
        .join('\n')}
    };

    ${values(contract.functions)
      .map((v) => v[0])
      .map(generateEncodeFunctionDataOverload)
      .join('\n')}

    ${values(contract.functions)
      .map((v) => v[0])
      .map(generateDecodeFunctionResultOverload)
      .join('\n')}

    events: {
      ${values(contract.events)
        .map((v) => v[0])
        .map(generateInterfaceEventDescription)
        .join('\n')}
    };

    ${values(contract.events)
      .map((v) => v[0])
      .map(generateGetEventOverload)
      .join('\n')}
  }

  export class ${contract.name} extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    listeners<EventArgsArray extends Array<any>, EventArgsObject>(eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>): Array<TypedListener<EventArgsArray, EventArgsObject>>;
    off<EventArgsArray extends Array<any>, EventArgsObject>(eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>, listener: TypedListener<EventArgsArray, EventArgsObject>): this;
    on<EventArgsArray extends Array<any>, EventArgsObject>(eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>, listener: TypedListener<EventArgsArray, EventArgsObject>): this;
    once<EventArgsArray extends Array<any>, EventArgsObject>(eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>, listener: TypedListener<EventArgsArray, EventArgsObject>): this;
    removeListener<EventArgsArray extends Array<any>, EventArgsObject>(eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>, listener: TypedListener<EventArgsArray, EventArgsObject>): this;
    removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>): this;

    listeners(eventName?: string): Array<Listener>;
    off(eventName: string, listener: Listener): this;
    on(eventName: string, listener: Listener): this;
    once(eventName: string, listener: Listener): this;
    removeListener(eventName: string, listener: Listener): this;
    removeAllListeners(eventName?: string): this;

    queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
      event: TypedEventFilter<EventArgsArray, EventArgsObject>,
      fromBlockOrBlockhash?: string | number | undefined,
      toBlock?: string | number | undefined
    ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

    interface: ${contract.name}Interface;

    functions: {
      ${values(contract.functions)
        .map(codegenFunctions.bind(null, { returnResultObject: true, codegenConfig }))
        .join('\n')}
    };

    ${values(contract.functions)
      .filter((f) => !reservedKeywords.has(f[0].name))
      .map(codegenFunctions.bind(null, { codegenConfig }))
      .join('\n')}

    callStatic: {
      ${values(contract.functions)
        .map(codegenFunctions.bind(null, { isStaticCall: true, codegenConfig }))
        .join('\n')}
    };

    filters: {
      ${values(contract.events)
        .map((v) => v[0])
        .map(generateEvents)
        .join('\n')}
    };

    estimateGas: {
      ${values(contract.functions)
        .map(codegenFunctions.bind(null, { overrideOutput: 'Promise<BigNumber>', codegenConfig }))
        .join('\n')}
    };

    populateTransaction: {
      ${values(contract.functions)
        .map(codegenFunctions.bind(null, { overrideOutput: 'Promise<PopulatedTransaction>', codegenConfig }))
        .join('\n')}
    };
  }`

  return template
}

export function codegenContractFactory(contract: Contract, abi: any, bytecode?: BytecodeWithLinkReferences): string {
  const constructorArgs =
    (contract.constructor && contract.constructor[0] ? generateInputTypes(contract.constructor[0].inputs) : '') +
    `overrides?: ${
      contract.constructor[0]?.stateMutability === 'payable'
        ? 'PayableOverrides & { from?: string | Promise<string> }'
        : 'Overrides & { from?: string | Promise<string> }'
    }`
  const constructorArgNamesWithoutOverrides =
    contract.constructor && contract.constructor[0] ? generateParamNames(contract.constructor[0].inputs) : ''
  const constructorArgNames = constructorArgNamesWithoutOverrides
    ? `${constructorArgNamesWithoutOverrides}, overrides || {}`
    : 'overrides || {}'
  if (!bytecode) return codegenAbstractContractFactory(contract, abi)

  // tsc with noUnusedLocals would complain about unused imports
  const ethersImports: string[] = ['Signer', 'utils']
  const optionalEthersImports = ['BytesLike', 'BigNumberish']
  optionalEthersImports.forEach((importName) => pushImportIfUsed(importName, constructorArgs, ethersImports))

  const ethersContractImports: string[] = ['Contract', 'ContractFactory']
  const optionalContractImports = ['PayableOverrides', 'Overrides']
  optionalContractImports.forEach((importName) => pushImportIfUsed(importName, constructorArgs, ethersContractImports))

  const { body, header } = codegenCommonContractFactory(contract, abi)

  return `
  import { ${[...ethersImports, ...ethersContractImports].join(', ')} } from "ethers";
  import { Provider, TransactionRequest } from '@ethersproject/providers';
  ${header}

  const _bytecode = "${bytecode.bytecode}";

  export class ${contract.name}${FACTORY_POSTFIX} extends ContractFactory {
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
    connect(signer: Signer): ${contract.name}${FACTORY_POSTFIX} {
      return super.connect(signer) as ${contract.name}${FACTORY_POSTFIX};
    }
    static readonly bytecode = _bytecode;
    ${body}
  }

  ${generateLibraryAddressesInterface(contract, bytecode)}
  `
}

export function codegenAbstractContractFactory(contract: Contract, abi: any): string {
  const { body, header } = codegenCommonContractFactory(contract, abi)
  return `
  import { Contract, Signer, utils } from "ethers";
  import { Provider } from "@ethersproject/providers";
  ${header}

  export class ${contract.name}${FACTORY_POSTFIX} {
    ${body}
  }
  `
}

function codegenCommonContractFactory(contract: Contract, abi: any): { header: string; body: string } {
  const header = `
  import type { ${contract.name}, ${contract.name}Interface } from "../${contract.name}";

  const _abi = ${JSON.stringify(abi, null, 2)};
  `.trim()
  const body = `
    static readonly abi = _abi;
    static createInterface(): ${contract.name}Interface {
      return new utils.Interface(_abi) as ${contract.name}Interface;
    }
    static connect(address: string, signerOrProvider: Signer | Provider): ${contract.name} {
      return new Contract(address, _abi, signerOrProvider) as ${contract.name};
    }
  `.trim()
  return { header, body }
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
      super(_abi, ${contract.name}${FACTORY_POSTFIX}.linkBytecode(linkLibraryAddresses), signer);
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

function generateInterfaceFunctionDescription(fn: FunctionDeclaration): string {
  return `'${generateFunctionSignature(fn)}': FunctionFragment;`
}

function generateFunctionSignature(fn: FunctionDeclaration): string {
  return `${fn.name}(${fn.inputs.map((input: any) => input.type.originalType).join(',')})`
}

function generateEncodeFunctionDataOverload(fn: FunctionDeclaration): string {
  const methodInputs = [`functionFragment: '${fn.name}'`]

  if (fn.inputs.length) {
    methodInputs.push(`values: [${fn.inputs.map((input) => generateInputType(input.type)).join(', ')}]`)
  } else {
    methodInputs.push('values?: undefined')
  }

  return `encodeFunctionData(${methodInputs.join(', ')}): string;`
}

function generateDecodeFunctionResultOverload(fn: FunctionDeclaration): string {
  return `decodeFunctionResult(functionFragment: '${fn.name}', data: BytesLike): Result;`
}

function generateParamNames(params: Array<AbiParameter | EventArgDeclaration>): string {
  return params.map((param, index) => param.name || `arg${index}`).join(', ')
}

function generateEvents(event: EventDeclaration) {
  const components = event.inputs.map((input, i) => ({ name: input.name ?? `arg${i.toString()}`, type: input.type }))
  const arrayOutput = generateOutputComplexTypeAsArray(components)
  const objectOutput = generateOutputComplexTypesAsObject(components) || '{}'

  return `
  ${event.name}(${generateEventTypes(event.inputs)}): TypedEventFilter<${arrayOutput}, ${objectOutput}>;
`
}

function generateInterfaceEventDescription(event: EventDeclaration): string {
  return `'${generateEventSignature(event)}': EventFragment;`
}

function generateEventSignature(event: EventDeclaration): string {
  return `${event.name}(${event.inputs.map((input: any) => input.type.originalType).join(',')})`
}

function generateEventTypes(eventArgs: EventArgDeclaration[]) {
  if (eventArgs.length === 0) {
    return ''
  }
  return (
    eventArgs
      .map((arg) => {
        return `${arg.name}?: ${generateEventArgType(arg)}`
      })
      .join(', ') + ', '
  )
}

function generateEventArgType(eventArg: EventArgDeclaration): string {
  return eventArg.isIndexed ? `${generateInputType(eventArg.type)} | null` : 'null'
}

function generateGetEventOverload(event: EventDeclaration): string {
  return `getEvent(nameOrSignatureOrTopic: '${event.name}'): EventFragment;`
}

function pushImportIfUsed(importName: string, generatedCode: string, importArray: string[]): void {
  if (new RegExp(`\\W${importName}(\\W|$)`).test(generatedCode)) importArray.push(importName)
}
