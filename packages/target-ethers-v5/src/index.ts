import { join, resolve } from 'path'
import { Dictionary } from 'ts-essentials'
import { TContext, TFileDesc, TsGeneratorPlugin } from 'ts-generator'
import {
  BytecodeWithLinkReferences,
  Contract,
  extractAbi,
  extractBytecode,
  extractDocumentation,
  getFileExtension,
  getFilename,
  parse,
} from 'typechain'

import { codegenAbstractContractFactory, codegenContractFactory, codegenContractTypings } from './codegen'
import { FACTORY_POSTFIX } from './common'

export interface IEthersCfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/ethers-contracts/'

export default class Ethers extends TsGeneratorPlugin {
  name = 'Ethers'
  allContracts: string[] = []

  private readonly outDirAbs: string
  private readonly contractCache: Dictionary<{
    abi: any
    contract: Contract
  }> = {}
  private readonly bytecodeCache: Dictionary<BytecodeWithLinkReferences> = {}

  constructor(ctx: TContext<IEthersCfg>) {
    super(ctx)

    const { cwd, rawConfig } = ctx

    this.outDirAbs = resolve(cwd, rawConfig.outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: TFileDesc): TFileDesc[] | void {
    const fileExt = getFileExtension(file.path)

    // For json files with both ABI and bytecode, both the contract typing and factory can be
    // generated at once. For split files (.abi and .bin) we don't know in which order they will
    // be transformed -- so we temporarily store whichever comes first, and generate the factory
    // only when both ABI and bytecode are present.

    if (fileExt === '.bin') {
      return this.transformBinFile(file)
    }
    return this.transformAbiOrFullJsonFile(file)
  }

  transformBinFile(file: TFileDesc): TFileDesc[] | void {
    const name = getFilename(file.path)
    const bytecode = extractBytecode(file.contents)

    if (!bytecode) {
      return
    }

    if (this.contractCache[name]) {
      const { contract, abi } = this.contractCache[name]
      delete this.contractCache[name]
      return [this.genContractFactoryFile(contract, abi, bytecode)]
    } else {
      this.bytecodeCache[name] = bytecode
    }
  }

  transformAbiOrFullJsonFile(file: TFileDesc): TFileDesc[] | void {
    const name = getFilename(file.path)
    const abi = extractAbi(file.contents)

    if (abi.length === 0) {
      return
    }

    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, name, documentation)
    const bytecode = extractBytecode(file.contents) || this.bytecodeCache[name]

    if (bytecode) {
      return [this.genContractTypingsFile(contract), this.genContractFactoryFile(contract, abi, bytecode)]
    } else {
      this.contractCache[name] = { abi, contract }
      return [this.genContractTypingsFile(contract)]
    }
  }

  genContractTypingsFile(contract: Contract): TFileDesc {
    this.allContracts.push(contract.name)

    return {
      path: join(this.outDirAbs, `${contract.name}.d.ts`),
      contents: codegenContractTypings(contract),
    }
  }

  genContractFactoryFile(contract: Contract, abi: any, bytecode?: BytecodeWithLinkReferences) {
    return {
      path: join(this.outDirAbs, 'factories', `${contract.name}${FACTORY_POSTFIX}.ts`),
      contents: codegenContractFactory(contract, abi, bytecode),
    }
  }

  afterRun(): TFileDesc[] {
    // For each contract that doesn't have bytecode (it's either abstract, or only ABI was provided)
    // generate a simplified factory, that allows to interact with deployed contract instances.
    const abstractFactoryFiles = Object.keys(this.contractCache).map((contractName) => {
      const { contract, abi } = this.contractCache[contractName]
      return {
        path: join(this.outDirAbs, 'factories', `${contract.name}${FACTORY_POSTFIX}.ts`),
        contents: codegenAbstractContractFactory(contract, abi),
      }
    })

    const allFiles = [
      ...abstractFactoryFiles,
      {
        path: join(this.outDirAbs, 'index.ts'),
        contents: this.genReExports(),
      },
    ]
    return allFiles
  }

  private genReExports(): string {
    const codegen: string[] = []

    for (const fileName of this.allContracts) {
      const desiredSymbol = fileName

      codegen.push(`export type { ${desiredSymbol} } from './${desiredSymbol}'`)
    }

    codegen.push('\n')

    // then generate reexports for TypeChain generated factories
    for (const fileName of this.allContracts) {
      const desiredSymbol = fileName + '__factory'

      codegen.push(`export { ${desiredSymbol} } from './factories/${desiredSymbol}'`)
    }

    return codegen.join('\n')
  }
}
