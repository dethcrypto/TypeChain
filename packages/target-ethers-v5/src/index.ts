import { readFileSync } from 'fs'
import { compact, uniqBy } from 'lodash'
import { basename, join, resolve } from 'path'
import { Dictionary } from 'ts-essentials'
import {
  BytecodeWithLinkReferences,
  CodegenConfig,
  Config,
  Contract,
  extractAbi,
  extractBytecode,
  extractDocumentation,
  FileDescription,
  getFileExtension,
  getFilename,
  normalizeName,
  parse,
  TypeChainTarget,
} from 'typechain'

import { codegenAbstractContractFactory, codegenContractFactory, codegenContractTypings } from './codegen'
import { generateHardhatHelper } from './codegen/hardhat'
import { FACTORY_POSTFIX } from './common'

export interface IEthersCfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/ethers-contracts/'

export default class Ethers extends TypeChainTarget {
  name = 'Ethers'

  private readonly allContracts: string[]
  private readonly outDirAbs: string
  private readonly contractCache: Dictionary<
    | {
        abi: any
        contract: Contract
      }
    | undefined
  > = {}
  private readonly bytecodeCache: Dictionary<BytecodeWithLinkReferences | undefined> = {}

  constructor(config: Config) {
    super(config)

    const { cwd, outDir, allFiles } = config

    this.outDirAbs = resolve(cwd, outDir || DEFAULT_OUT_PATH)

    this.allContracts = allFiles.map((fp) => normalizeName(getFilename(fp)))
  }

  transformFile(file: FileDescription): FileDescription[] | void {
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

  transformBinFile(file: FileDescription): FileDescription[] | void {
    const name = getFilename(file.path)
    const bytecode = extractBytecode(file.contents)

    if (!bytecode) {
      return
    }

    if (this.contractCache[name]) {
      const { contract, abi } = this.contractCache[name]!
      delete this.contractCache[name]
      return [this.genContractFactoryFile(contract, abi, bytecode)]
    } else {
      this.bytecodeCache[name] = bytecode
    }
  }

  transformAbiOrFullJsonFile(file: FileDescription): FileDescription[] | void {
    const name = getFilename(file.path)
    const abi = extractAbi(file.contents)

    if (abi.length === 0) {
      return
    }

    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, name, documentation)
    const bytecode = extractBytecode(file.contents) || this.bytecodeCache[name]

    if (bytecode) {
      return [
        this.genContractTypingsFile(contract, this.cfg.flags),
        this.genContractFactoryFile(contract, abi, bytecode),
      ]
    } else {
      this.contractCache[name] = { abi, contract }
      return [this.genContractTypingsFile(contract, this.cfg.flags)]
    }
  }

  genContractTypingsFile(contract: Contract, codegenConfig: CodegenConfig): FileDescription {
    return {
      path: join(this.outDirAbs, `${contract.name}.d.ts`),
      contents: codegenContractTypings(contract, codegenConfig),
    }
  }

  genContractFactoryFile(contract: Contract, abi: any, bytecode?: BytecodeWithLinkReferences) {
    return {
      path: join(this.outDirAbs, 'factories', `${contract.name}${FACTORY_POSTFIX}.ts`),
      contents: codegenContractFactory(contract, abi, bytecode),
    }
  }

  afterRun(): FileDescription[] {
    // For each contract that doesn't have bytecode (it's either abstract, or only ABI was provided)
    // generate a simplified factory, that allows to interact with deployed contract instances.
    const abstractFactoryFiles = Object.keys(this.contractCache).map((contractName) => {
      const { contract, abi } = this.contractCache[contractName]!
      return {
        path: join(this.outDirAbs, 'factories', `${contract.name}${FACTORY_POSTFIX}.ts`),
        contents: codegenAbstractContractFactory(contract, abi),
      }
    })

    const hardhatHelper =
      this.cfg.flags.environment === 'hardhat'
        ? { path: join(this.outDirAbs, 'hardhat.d.ts'), contents: generateHardhatHelper(this.allContracts) }
        : undefined

    const allFiles = compact([
      ...abstractFactoryFiles,
      {
        path: join(this.outDirAbs, 'common.d.ts'),
        contents: readFileSync(join(__dirname, '../static/common.d.ts'), 'utf-8'),
      },
      {
        path: join(this.outDirAbs, 'index.ts'),
        contents: this.genReExports(),
      },
      hardhatHelper,
    ])
    return allFiles
  }

  private genReExports(): string {
    const codegen: string[] = []

    const allContractsNoDuplicates = uniqBy(this.allContracts, (c) => basename(c))

    for (const fileName of allContractsNoDuplicates) {
      const desiredSymbol = fileName

      codegen.push(`export type { ${desiredSymbol} } from './${desiredSymbol}'`)
    }

    codegen.push('\n')

    // then generate reexports for TypeChain generated factories
    for (const fileName of allContractsNoDuplicates) {
      const desiredSymbol = fileName + '__factory'

      codegen.push(`export { ${desiredSymbol} } from './factories/${desiredSymbol}'`)
    }

    return codegen.join('\n')
  }
}
