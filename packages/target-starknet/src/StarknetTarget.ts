import { uniqBy, zip } from 'lodash'
import { join, relative, resolve } from 'path'
import { Abi, FunctionAbi, json } from 'starknet'
import { AbiEntry, StructAbi } from 'starknet/types/lib'
import {
  Config,
  FileDescription,
  normalizeSlashes,
  Output,
  parseContractPath,
  shortenFullJsonFilePath,
  TypeChainTarget,
} from 'typechain'

import { importer } from './importer'

const DEFAULT_OUT_PATH = './types/starknet-contracts/'

export class StarknetTarget extends TypeChainTarget {
  name = 'StarknetTarget'

  private readonly allFiles: string[]
  private readonly outDirAbs: string

  constructor(config: Config) {
    super(config)

    const { cwd, outDir, allFiles } = config

    this.allFiles = allFiles
      .map((p) => shortenFullJsonFilePath(p, allFiles))
      .map((p) => relative(this.cfg.inputDir, p))
      .map(normalizeSlashes)
    this.outDirAbs = resolve(cwd, outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: FileDescription): Output {
    const compiled = json.parse(file.contents)
    const name = parseContractPath(file.path).rawName

    const {
      structTypes,
      // constructorArgs,
      functions,
      imports,
      impoort,
    } = transformer(compiled.abi)

    const ContractInterface = impoort('starknet', 'Contract')
    // const ContractFactory = impoort('starknet', 'ContractFactory')
    // const Contract = impoort('starknet', 'Contract')
    // const contractFactory = `
    //   export interface ${name}Factory extends ${ContractFactory} {
    //     async deploy(
    //       constructorCalldata?: [${constructorArgs()}],
    //       addressSalt?: BigNumberish
    //     ): Promise<${Contract}>
    //   }
    // `

    const resultWithoutImports = `
      ${structTypes()}
      export interface ${name} extends ${ContractInterface} {
        ${functions('default').join('\n')}
        functions: {
          ${functions('default').join('\n')}
        }
        callStatic: {
          ${functions('call').join('\n')}
        }
        populateTransaction: {
          ${functions('populate').join('\n')}
        }
        estimateFee: {
          ${functions('estimate').join('\n')}
        }
      }
    `
    const result = `
      ${imports()}
      ${resultWithoutImports}
    `

    return {
      contents: result,
      path: join(this.outDirAbs, `${name}.ts`), // @todo fix, should have same behaviour as in other plugins
    }
  }

  override afterRun(): FileDescription[] {
    const index = {
      path: join(this.outDirAbs, 'index.ts'),
      contents: createIndexContents(this.allFiles),
    }

    return [index]
  }
}
type DeclarationType = 'default' | 'call' | 'populate' | 'estimate'
type AbiEntriesByName = Map<string, FunctionAbi | StructAbi>

function byName(abi: Abi): AbiEntriesByName {
  return abi.reduce((r, e) => r.set(e.name, e), new Map<string, FunctionAbi | StructAbi>())
}

function transformer(rawAbi: Abi) {
  const abi = byName(rawAbi)
  const { imports, impoort } = importer()

  function constructorArgs(): string {
    const constructorAbi: FunctionAbi | undefined = [...(abi.values() as any)].find((e) => e.type === 'constructor')

    return constructorAbi ? entriesTypesOnly(constructorAbi.inputs) : ''
  }

  function options(e: FunctionAbi, returnType: DeclarationType): string {
    // TODO: Why estimate takes blockIdentifier?
    if ((returnType === 'populate' || returnType === 'default') && e.stateMutability !== 'view') {
      const Overrides = impoort('starknet', 'Overrides')
      return `options?: ${Overrides}`
    }
    const BlockIdentifier = impoort('starknet/provider/utils', 'BlockIdentifier')
    // TODO: Why BlockIdentifier is optional here?
    return `options?: { blockIdentifier?: ${BlockIdentifier}; }`
  }

  function functions(returnType: DeclarationType): string[] {
    return [...(abi.values() as any)] // @todo fix any
      .filter((e) => e.type === 'function') // && e.stateMutability === "view"
      .map((e: FunctionAbi) => {
        const args = entries(e.inputs)
        const opts = options(e, returnType)
        const rets = returns(e, returnType)
        return `${e.name}(${args}${args !== '' ? ', ' : ''}${opts}):${rets}`
      })
  }

  // function generateEventTypes(): string {
  //   const events = [...(abi.values() as any)] // @todo fix any
  //     .filter((e) => e.type === 'event');
  //   return events.map(e =>
  //     `export type ${e.name} = {
  //     ${entriesToInterface(e.data)}\n
  //   }`
  //   ).join('\n');
  // }

  function structTypes(): string {
    const structs = [...(abi.values() as any)] // @todo fix any
      .filter((e) => e.type === 'struct')
    const namedStructs = structs.filter((s) => !!s.name)
    return namedStructs
      .map(
        (s) =>
          `export type ${s.name} = {
      ${entriesToInterface(s.members)}\n
    }`,
      )
      .join('\n')
  }

  function viewType(e: FunctionAbi) {
    return `[${entriesTypesOnly(e.outputs)}] & {${entries(e.outputs)}}`
  }

  function returns(e: FunctionAbi, returnType: DeclarationType): string {
    switch (returnType) {
      case 'default':
        return e.stateMutability === 'view'
          ? `Promise<${viewType(e)}>`
          : `Promise<${impoort('starknet', 'AddTransactionResponse')}>`
      case 'call':
        return `Promise<${viewType(e)}>`
      case 'populate':
        return `${impoort('starknet', 'Invocation')}`
      case 'estimate':
        return `Promise<${impoort('starknet', 'EstimateFeeResponse')}>`
    }
  }

  function entriesPairs(abiEntries: AbiEntry[]) {
    if (abiEntries.length === 0) {
      return []
    }

    return zip(abiEntries, abiEntries.slice(1), [undefined, ...abiEntries.slice(0, -1)])
      .filter(([e, n]) => !(n && `${n.name}_len` === e!.name && n.type.slice(-1) === '*'))
      .map(
        (
          [e, _, p], // @todo fix !
        ) =>
          p && `${e!.name}_len` === p.name && e!.type.slice(-1) === '*'
            ? [`${e!.name}`, `${mapType(e!.type.slice(0, -1))}[]`]
            : [`${e!.name}`, `${mapType(e!.type)}`],
      )
  }

  function entries(abiEntries: AbiEntry[]) {
    return entriesPairs(abiEntries)
      .map(([name, type]) => `${name}: ${type}`)
      .join(', ')
  }

  function entriesToInterface(abiEntries: AbiEntry[]) {
    return entriesPairs(abiEntries)
      .map(([name, type]) => `${name}: ${type}`)
      .join(';\n')
  }

  function entriesTypesOnly(abiEntries: AbiEntry[]) {
    return entriesPairs(abiEntries)
      .map(([_, type]) => `${type}`)
      .join(', ')
  }

  const tuple = /\(([^,]+)(, ([^,]+))*\)/
  const space = /\s/g

  function mapType(type: AbiEntry['type']): string {
    if (type === 'felt') {
      return impoort('starknet/utils/number', 'BigNumberish')
    }

    // Disabled as this feature is not yet available in starknet.js
    // if (type === 'Uint256') {
    //   const entry = abi.get(type)! // @todo undefined
    //   if (entry.type === 'struct' &&
    //     entry.members.length === 2 &&
    //     entry.members[0].name === 'low' && entry.members[0].type === 'felt' &&
    //     entry.members[1].name === 'high' && entry.members[1].type === 'felt'
    //   ) {
    //     return impoort('starknet/utils/number', 'BigNumberish')
    //   }
    // }

    if (tuple.test(type)) {
      const types = type.slice(1, -1).replace(space, '').split(',')
      return `[${types.map((t) => mapType(t)).join(', ')}]`
    }

    if (abi.has(type)) {
      const entry = abi.get(type)! // @todo undefined
      if (entry.type === 'struct') {
        return `${entry.name}`
      }
    }

    return type
  }

  return {
    structTypes,
    constructorArgs,
    functions,
    imports,
    impoort,
  }
}

function createIndexContents(paths: string[]) {
  const contracts: { path: string[]; rawName: string }[] = paths.map(parseContractPath)

  return uniqBy(Object.values(contracts), (c) => c.rawName)
    .flatMap((c) => {
      const path = c.path.length === 0 ? c.rawName : `${c.path.join('/')}/${c.rawName}`
      return [`export type { ${c.rawName} } from './${path}';`]
    })
    .join('\n')
}
