import { zip } from 'lodash'
import { join, resolve } from 'path'
import { Abi, FunctionAbi, json } from 'starknet'
import { AbiEntry, StructAbi } from 'starknet/types/lib'
import { Config, FileDescription, Output, TypeChainTarget } from 'typechain'

import { importer, Impoort } from './importer'

const DEFAULT_OUT_PATH = './types/starknet-contracts/'

type Member = AbiEntry & { offset: number };

export class StarknetTarget extends TypeChainTarget {
  name = 'StarknetTarget'
  private readonly outDirAbs: string

  constructor(config: Config) {
    super(config)

    const { cwd, outDir } = config

    this.outDirAbs = resolve(cwd, outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: FileDescription): Output {
    const compiled = json.parse(file.contents)
    const name = file.path.split('/').splice(-1)[0].replace('.json', '')
    const abiByName = byName(compiled.abi)

    const { imports, impoort } = importer()

    impoort('starknet/utils/number', 'BigNumberish') //TODO: move somewhere else
    const ContractInterface = impoort('starknet', 'ContractInterface')
    const contractInterface = `
      ${generateStructTypes(abiByName)}

      export interface ${name} extends ${ContractInterface} {
        ${functions(abiByName, 'default', impoort).join('\n')}
        functions: {
          ${functions(abiByName, 'default', impoort).join('\n')}
        }
        callStatic: {
          ${functions(abiByName, 'call', impoort).join('\n')}
        }
        populateTransaction: {
          ${functions(abiByName, 'populate', impoort).join('\n')}
        }
        estimateFee: {
          ${functions(abiByName, 'estimate', impoort).join('\n')}
        }
      }`

    const ContractFactory = impoort('starknet', 'ContractFactory')
    const Contract = impoort('starknet', 'Contract')
    const contractFactory = `
      export interface ${name}Factory extends ${ContractFactory} {
        async deploy(
          constructorCalldata?: [${constructorArgs(abiByName)}],
          addressSalt?: BigNumberish
        ): Promise<${Contract}>
      }
    `

    const result = `
      ${imports()}
      ${contractFactory}
      ${contractInterface}
    `

    return {
      contents: result,
      path: join(this.outDirAbs, `${name}.ts`), // @todo fix, should have same behaviour as in other plugins
    }
  }
}

function constructorArgs(abi: AbiEntriesByName): string {
  const constructorAbi: FunctionAbi | undefined = [...(abi.values() as any)].find((e) => e.type === 'constructor')

  return constructorAbi ? entriesTypesOnly(abi, constructorAbi.inputs) : ''
}

type AbiEntriesByName = Map<string, FunctionAbi | StructAbi>

function byName(abi: Abi): AbiEntriesByName {
  return abi.reduce((r, e) => r.set(e.name, e), new Map<string, FunctionAbi | StructAbi>())
}

type DeclarationType = 'default' | 'call' | 'populate' | 'estimate'

function options(returnType: DeclarationType, impoort: Impoort): string {
  const Overrides = impoort('starknet', 'Overrides')
  const BlockIdentifier = impoort('starknet/provider/utils', 'BlockIdentifier')
  // TODO: Why estimate takes blockIdentifier?
  if (returnType === 'populate') {
    return `options?: ${Overrides}`
  }
  // TODO: Why BlockIdentifier is optional here?
  return `options?: { blockIdentifier?: ${BlockIdentifier}; }`
}

function functions(abi: AbiEntriesByName, returnType: DeclarationType, impoort: Impoort): string[] {
  return [...(abi.values() as any)] // @todo fix any
    .filter((e) => e.type === 'function') // && e.stateMutability === "view"
    .map((e: FunctionAbi) => {
      const args = entries(abi, e.inputs)
      const opts = options(returnType, impoort)
      const rets = returns(abi, e, returnType, impoort)
      return `${e.name}(${args}${args !== '' ? ', ' : ''}${opts}):${rets}`
    })
}

function generateEventTypes(abi: AbiEntriesByName): string {
  const events = [...(abi.values() as any)] // @todo fix any
    .filter((e) => e.type === 'event');
  return events.map(e =>
    `export type ${e.name} = {
      ${entriesToInterface(abi, e.data)}\n
    }`
  ).join('\n');
}

function generateStructTypes(abi: AbiEntriesByName): string {
  const structs = [...(abi.values() as any)] // @todo fix any
    .filter((e) => e.type === 'struct');
  const namedStructs = structs.filter((s) => !!s.name);
  return namedStructs.map(s =>
    `export type ${s.name} = {
      ${entriesToInterface(abi, s.members)}\n
    }`
  ).join('\n');
}

function viewType(abi: AbiEntriesByName, e: FunctionAbi) {
  return `[${entriesTypesOnly(abi, e.outputs)}] & {${entries(abi, e.outputs)}}`
}

function returns(abi: AbiEntriesByName, e: FunctionAbi, returnType: DeclarationType, impoort: Impoort): string {
  switch (returnType) {
    case 'default':
      return e.stateMutability === 'view'
        ? `Promise<${viewType(abi, e)}>`
        : `Promise<${impoort('starknet', 'AddTransactionResponse')}>`
    case 'call':
      return `Promise<${viewType(abi, e)}>`
    case 'populate':
      return `${impoort('starknet', 'Invocation')}`
    case 'estimate':
      return `Promise<${impoort('starknet', 'EstimateFeeResponse')}>`
  }
}

function entriesPairs(abi: AbiEntriesByName, abiEntries: AbiEntry[]) {
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
          ? [`${e!.name}`, `${mapType(abi, e!.type.slice(0, -1))}[]`]
          : [`${e!.name}`, `${mapType(abi, e!.type)}`],
    )
}

function entries(abi: AbiEntriesByName, abiEntries: AbiEntry[]) {
  return entriesPairs(abi, abiEntries)
    .map(([name, type]) => `${name}: ${type}`)
    .join(', ')
}

function entriesToInterface(abi: AbiEntriesByName, abiEntries: AbiEntry[]) {
  return entriesPairs(abi, abiEntries)
    .map(([name, type]) => `${name}: ${type}`)
    .join(';\n')
}

function entriesTypesOnly(abi: AbiEntriesByName, abiEntries: AbiEntry[]) {
  return entriesPairs(abi, abiEntries)
    .map(([_, type]) => `${type}`)
    .join(', ')
}

const tuple = /\(([^,]+)(, ([^,]+))*\)/
const space = /\s/g

function mapType(abi: AbiEntriesByName, type: AbiEntry['type']): string {
  if (type === 'felt') {
    return 'BigNumberish'
  }

  if (type === 'Uint256') {
    const entry = abi.get(type)! // @todo undefined
    if (entry.type === 'struct' && entry.members.length === 2) {
      //TODO: be more precise
      return 'BigNumberish'
    }
  }

  if (tuple.test(type)) {
    const types = type.slice(1, -1).replace(space, '').split(',')
    return `[${types.map((t) => mapType(abi, t)).join(', ')}]`
  }

  if (abi.has(type)) {
    const entry = abi.get(type)! // @todo undefined
    if (entry.type === 'struct') {
      return `${entry.name}`
    }
  }

  return type
}
