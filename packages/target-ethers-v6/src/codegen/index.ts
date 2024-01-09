/* eslint-disable import/no-extraneous-dependencies */
import { isString, values } from 'lodash'
import {
  BytecodeWithLinkReferences,
  CodegenConfig,
  Contract,
  createImportsForUsedIdentifiers,
  EventDeclaration,
  FunctionDeclaration,
  StructType,
} from 'typechain'

import { FACTORY_POSTFIX, STRUCT_INPUT_POSTFIX } from '../common'
import {
  EVENT_IMPORTS,
  EVENT_METHOD_OVERRIDES,
  generateEventFilters,
  generateEventNameOrSignature,
  generateEventTypeExports,
  generateGetEventForContract,
  generateGetEventForInterface,
} from './events'
import {
  codegenFunctions,
  FUNCTION_IMPORTS,
  generateDecodeFunctionResultOverload,
  generateEncodeFunctionDataOverload,
  generateFunctionNameOrSignature,
  generateGetFunctionForContract,
  generateGetFunctionForInterface,
  generateParamNames,
} from './functions'
import { baseContractProperties, ethersPassProperties } from './reserved-keywords'
import { generateStructTypes } from './structs'
import { generateInputTypes } from './types'

export function codegenContractTypings(contract: Contract, codegenConfig: CodegenConfig) {
  const { alwaysGenerateOverloads } = codegenConfig

  const source = `
  ${generateStructTypes(values(contract.structs).map((v) => v[0]))}

  export interface ${contract.name}Interface extends Interface {
    ${generateGetFunctionForInterface(
      values(contract.functions).flatMap((v) =>
        processDeclaration(v, alwaysGenerateOverloads, generateFunctionNameOrSignature),
      ),
    )}

    ${generateGetEventForInterface(
      values(contract.events).flatMap((v) =>
        processDeclaration(v, alwaysGenerateOverloads, generateEventNameOrSignature),
      ),
    )}

    ${values(contract.functions)
      .flatMap((v) => processDeclaration(v, alwaysGenerateOverloads, generateEncodeFunctionDataOverload))
      .join('\n')}

    ${values(contract.functions)
      .flatMap((v) => processDeclaration(v, alwaysGenerateOverloads, generateDecodeFunctionResultOverload))
      .join('\n')}
  }

  ${values(contract.events).map(generateEventTypeExports).join('\n')}

  export interface ${contract.name} extends BaseContract {
    ${codegenConfig.discriminateTypes ? `contractName: '${contract.name}';\n` : ``}
    connect(runner?: ContractRunner | null): ${contract.name};
    waitForDeployment(): Promise<this>;

    interface: ${contract.name}Interface;

    ${EVENT_METHOD_OVERRIDES}

    
    ${values(contract.functions)
      .filter((f) => !ethersPassProperties.has(f[0].name) && !baseContractProperties.has(f[0].name))
      .map(codegenFunctions.bind(null, { codegenConfig }))
      .join('\n')}


    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

    ${values(contract.functions)
      .flatMap((v) => processDeclaration(v, alwaysGenerateOverloads, generateGetFunctionForContract))
      .join('\n')}

    ${values(contract.events)
      .flatMap((v) => processDeclaration(v, alwaysGenerateOverloads, generateGetEventForContract))
      .join('\n')}

    filters: {
      ${values(contract.events).map(generateEventFilters).join('\n')}
    };
  }`

  const moduleSuffix = codegenConfig.node16Modules ? '.js' : ''
  const commonPath =
    (contract.path.length ? `${new Array(contract.path.length).fill('..').join('/')}/common` : './common') +
    moduleSuffix

  const imports =
    createImportsForUsedIdentifiers(
      {
        'type ethers': [
          'BaseContract',
          'BigNumberish',
          'BytesLike',
          'ContractTransaction',
          'FunctionFragment',
          'Result',
          'Interface',
          'EventFragment',
          'AddressLike',
          'ContractRunner',
          'TransactionRequest',
          'ContractEvent',
          'ContractMethod',
          'EventLog',
          'Listener',
        ],
      },
      source,
    ) +
    '\n' +
    createImportsForUsedIdentifiers({ ['type ' + commonPath]: [...EVENT_IMPORTS, ...FUNCTION_IMPORTS] }, source)

  return imports + source
}

export function codegenContractFactory(
  codegenConfig: CodegenConfig,
  contract: Contract,
  abi: any,
  bytecode?: BytecodeWithLinkReferences,
): string {
  const moduleSuffix = codegenConfig.node16Modules ? '.js' : ''
  const constructorArgs =
    (contract.constructor[0] ? generateInputTypes(contract.constructor[0].inputs, { useStructs: true }) : '') +
    `overrides?: ${
      contract.constructor[0]?.stateMutability === 'payable'
        ? 'PayableOverrides & { from?: string }'
        : 'NonPayableOverrides & { from?: string }'
    }`
  const constructorArgNamesWithoutOverrides = contract.constructor[0]
    ? generateParamNames(contract.constructor[0].inputs)
    : ''
  const constructorArgNames = constructorArgNamesWithoutOverrides
    ? `${constructorArgNamesWithoutOverrides}, overrides || {}`
    : 'overrides || {}'
  if (!bytecode) return codegenAbstractContractFactory(contract, abi, moduleSuffix)

  // tsc with noUnusedLocals would complain about unused imports

  const { body, header } = codegenCommonContractFactory(contract, abi, moduleSuffix)

  const source = `
  ${header}

  const _bytecode = "${bytecode.bytecode}";

  ${generateFactoryConstructorParamsAlias(contract, bytecode)}

  export class ${contract.name}${FACTORY_POSTFIX} extends ContractFactory {
    ${generateFactoryConstructor(codegenConfig, contract, bytecode)}
    override getDeployTransaction(${constructorArgs}): Promise<ContractDeployTransaction> {
      return super.getDeployTransaction(${constructorArgNames});
    };
    override deploy(${constructorArgs}) {
      return super.deploy(${constructorArgNames}) as Promise<${contract.name} & {
        deploymentTransaction(): ContractTransactionResponse;
      }>;
    }
    override connect(runner: ContractRunner | null): ${contract.name}${FACTORY_POSTFIX} {
      return super.connect(runner) as ${contract.name}${FACTORY_POSTFIX};
    }
    ${codegenConfig.discriminateTypes ? `static readonly contractName: '${contract.name}';\n` : ``}
    ${codegenConfig.discriminateTypes ? `public readonly contractName: '${contract.name}';\n` : ``}
    static readonly bytecode = _bytecode;
    ${body}
  }

  ${generateLibraryAddressesInterface(contract, bytecode)}
  `

  const commonPath = `${new Array(contract.path.length + 1).fill('..').join('/')}/common${moduleSuffix}`

  const imports =
    createImportsForUsedIdentifiers(
      {
        ethers: ['Contract', 'ContractFactory', 'ContractTransactionResponse', 'Interface'],
        'type ethers': [
          'Signer',
          'BytesLike',
          'BigNumberish',
          'Overrides',
          'AddressLike',
          'ContractDeployTransaction',
          'Provider',
          'TransactionRequest',
          'ContractRunner',
        ],
      },
      source,
    ) +
    '\n' +
    createImportsForUsedIdentifiers({ ['type ' + commonPath]: [...EVENT_IMPORTS, ...FUNCTION_IMPORTS] }, source)

  return imports + source
}

export function codegenAbstractContractFactory(contract: Contract, abi: any, moduleSuffix: string): string {
  const { body, header } = codegenCommonContractFactory(contract, abi, moduleSuffix)
  return `
  import { Contract, Interface, type ContractRunner } from "ethers";
  ${header}

  export class ${contract.name}${FACTORY_POSTFIX} {
    ${body}
  }
  `
}

function codegenCommonContractFactory(
  contract: Contract,
  abi: any,
  moduleSuffix: string,
): { header: string; body: string } {
  const imports: Set<string> = new Set([contract.name, contract.name + 'Interface'])

  contract.constructor[0]?.inputs.forEach(({ type }) => {
    const { structName } = type as StructType
    if (structName) {
      imports.add(structName.namespace || structName.identifier + STRUCT_INPUT_POSTFIX)
    }
  })

  const contractTypesImportPath = [
    ...Array(contract.path.length + 1).fill('..'),
    ...contract.path,
    contract.name + moduleSuffix,
  ].join('/')

  const header = `
  import type { ${[...imports.values()].join(', ')} } from "${contractTypesImportPath}";

  const _abi = ${JSON.stringify(abi, null, 2)} as const;
  `.trim()

  const body = `
    static readonly abi = _abi;
    static createInterface(): ${contract.name}Interface {
      return new Interface(_abi) as ${contract.name}Interface;
    }
    static connect(address: string, runner?: ContractRunner | null): ${contract.name} {
      return new Contract(address, _abi, runner) as unknown as ${contract.name};
    }
  `.trim()

  return { header, body }
}

function generateFactoryConstructor(
  codegenConfig: CodegenConfig,
  contract: Contract,
  bytecode: BytecodeWithLinkReferences,
): string {
  if (!bytecode.linkReferences) {
    return `
      constructor(...args: ${contract.name}ConstructorParams) {
        if (isSuperArgs(args)) {
          super(...args);
        } else {
          super(_abi, _bytecode, args[0]);
        }
        ${codegenConfig.discriminateTypes ? `this.contractName = '${contract.name}';` : ''}
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
      ${codegenConfig.discriminateTypes ? `this.contractName = '${contract.name}';` : ''}
    }

    static linkBytecode(linkLibraryAddresses: ${libAddressesName}): string {
      let linkedBytecode = _bytecode;
      ${linkRefReplacements.join('\n')}

      return linkedBytecode;
    }
  `
}

function generateFactoryConstructorParamsAlias(contract: Contract, bytecode: BytecodeWithLinkReferences): string {
  const name = `${contract.name}ConstructorParams`

  if (bytecode.linkReferences) {
    return `
      type ${name} =
        | [linkLibraryAddresses: ${contract.name}LibraryAddresses, signer?: Signer]
        | ConstructorParameters<typeof ContractFactory>;

      const isSuperArgs = (
        xs: ${name}
      ): xs is ConstructorParameters<typeof ContractFactory> => {
        return typeof xs[0] === 'string'
          || (Array.isArray as (arg: any) => arg is readonly any[])(xs[0])
          || '_isInterface' in xs[0]
      }`
  } else {
    return `
      type ${name} = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

      const isSuperArgs = (xs: ${name}): xs is ConstructorParameters<typeof ContractFactory> =>
        xs.length > 1
    `
  }
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

/**
 * Instruments code generator based on the number of overloads and config flag.
 *
 * @param fns - overloads of the function
 * @param forceGenerateOverloads - flag to force generation of overloads.
 *        If set to true, full signatures will be used even if the function is not overloaded.
 * @param stringGen - function generating source code based on the declaration
 * @returns generated source code
 */
function processDeclaration<D extends FunctionDeclaration | EventDeclaration>(
  fns: D[],
  forceGenerateOverloads: boolean,
  stringGen: (fn: D, useSignature: boolean) => string,
) {
  // Function is overloaded, we need unambiguous signatures
  if (fns.length > 1) {
    return fns.map((fn) => stringGen(fn, true))
  }

  return [stringGen(fns[0], false), forceGenerateOverloads && stringGen(fns[0], true)].filter(isString)
}
