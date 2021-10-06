import { values } from 'lodash'
import { BytecodeWithLinkReferences, CodegenConfig, Contract } from 'typechain'

import { FACTORY_POSTFIX } from '../common'
import {
  EVENT_IMPORTS,
  EVENT_METHOD_OVERRIDES,
  generateEventFilters,
  generateEventTypeExports,
  generateGetEventOverload,
  generateInterfaceEventDescription,
} from './events'
import {
  codegenFunctions,
  generateDecodeFunctionResultOverload,
  generateEncodeFunctionDataOverload,
  generateInterfaceFunctionDescription,
  generateParamNames,
} from './functions'
import { reservedKeywords } from './reserved-keywords'
import { generateStruct } from './structs'
import { generateInputTypes } from './types'

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
  import type { ${EVENT_IMPORTS.join(', ')} } from './common';

  ${values(contract.structs)
    .map((v) => generateStruct(v[0]))
    .join('\n')}

  export interface ${contract.name}Interface extends ethers.utils.Interface {
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

  ${values(contract.events).map(generateEventTypeExports).join('\n')}

  export interface ${contract.name} extends BaseContract {
    connect(signerOrProvider: Signer | Provider | string): this;
    attach(addressOrName: string): this;
    deployed(): Promise<this>;

    interface: ${contract.name}Interface;

    ${EVENT_METHOD_OVERRIDES}

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
      ${values(contract.events).map(generateEventFilters).join('\n')}
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
    (contract.constructor[0] ? generateInputTypes(contract.constructor[0].inputs, { useStructs: true }) : '') +
    `overrides?: ${
      contract.constructor[0]?.stateMutability === 'payable'
        ? 'PayableOverrides & { from?: string | Promise<string> }'
        : 'Overrides & { from?: string | Promise<string> }'
    }`
  const constructorArgNamesWithoutOverrides = contract.constructor[0]
    ? generateParamNames(contract.constructor[0].inputs)
    : ''
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

  ${generateFactoryConstructorParamsAlias(contract, bytecode)}

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
    constructor(
      ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
    ) {
      if (args.length === 1) {
        super(_abi, _bytecode, args[0]);
      } else {
        super(...args);
      }
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

  const className = `${contract.name}${FACTORY_POSTFIX}`
  const libAddressesName = `${contract.name}LibraryAddresses`

  return `
    constructor(
      ...args: ${contract.name}ConstructorParams
    ) {
      if (isSuperArgs(args)) {
        super (...args)
      } else {
        const [linkLibraryAddresses, signer] = args;
        super(
          _abi,
          ${className}.linkBytecode(linkLibraryAddresses),
          signer
        )
      }
    }

    static linkBytecode(linkLibraryAddresses: ${libAddressesName}): string {
      let linkedBytecode = _bytecode;
      ${linkRefReplacements.join('\n')}

      return linkedBytecode;
    }
  `
}

function generateFactoryConstructorParamsAlias(contract: Contract, bytecode: BytecodeWithLinkReferences): string {
  if (bytecode.linkReferences) {
    const name = `${contract.name}ConstructorParams`
    return `\
      type ${name} =
        | [linkLibraryAddresses: ${contract.name}LibraryAddresses, signer?: Signer]
        | ConstructorParameters<typeof ContractFactory>

      const isSuperArgs = (
        xs: ${name}
      ): xs is ConstructorParameters<typeof ContractFactory> => {
        return typeof xs[0] === 'string'
          || (Array.isArray as (arg: any) => arg is readonly any[])(xs[0])
          || '_isInterface' in xs[0]
      }`
  }

  return ''
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

function pushImportIfUsed(importName: string, generatedCode: string, importArray: string[]): void {
  if (new RegExp(`\\W${importName}(\\W|$)`).test(generatedCode)) importArray.push(importName)
}
