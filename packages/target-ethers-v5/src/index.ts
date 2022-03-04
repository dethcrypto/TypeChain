import { readFileSync } from 'fs'
import { compact } from 'lodash'
import { dirname, join, relative, resolve } from 'path'
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
  normalizeSlashes,
  parse,
  TypeChainTarget,
} from 'typechain'

import { codegenAbstractContractFactory, codegenContractFactory, codegenContractTypings } from './codegen'
import { generateHardhatHelper } from './codegen/hardhat'
import { FACTORY_POSTFIX } from './common'
import { generateBarrelFiles, lowestCommonPath } from './path-utils'

export interface IEthersCfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/ethers-contracts/'

export default class Ethers extends TypeChainTarget {
  name = 'Ethers'

  private readonly inputsRoot: string
  private readonly allFiles: string[]
  private readonly outDirAbs: string
  private readonly contractCache: Dictionary<{ abi: any; contract: Contract } | undefined> = {}
  private readonly bytecodeCache: Dictionary<BytecodeWithLinkReferences | undefined> = {}

  constructor(config: Config) {
    super(config)

    const { cwd, outDir, allFiles } = config

    this.inputsRoot = dirname(lowestCommonPath(allFiles))
    this.allFiles = allFiles.map((x) => normalizeSlashes(relative(this.inputsRoot, x)))
    this.outDirAbs = resolve(cwd, outDir || DEFAULT_OUT_PATH)
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
    const bytecode = extractBytecode(file.contents)

    if (!bytecode) {
      return
    }

    if (this.contractCache[file.path]) {
      const { contract, abi } = this.contractCache[file.path]!
      delete this.contractCache[file.path]
      return [this.genContractFactoryFile(contract, abi, bytecode)]
    } else {
      this.bytecodeCache[file.path] = bytecode
    }
  }

  transformAbiOrFullJsonFile(file: FileDescription): FileDescription[] | void {
    const abi = extractAbi(file.contents)

    if (abi.length === 0) {
      return
    }

    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, relative(this.inputsRoot, file.path), documentation)
    const bytecode = extractBytecode(file.contents) || this.bytecodeCache[file.path]

    if (bytecode) {
      return [
        this.genContractTypingsFile(contract, this.cfg.flags),
        this.genContractFactoryFile(contract, abi, bytecode),
      ]
    } else {
      this.contractCache[file.path] = { abi, contract }
      return [this.genContractTypingsFile(contract, this.cfg.flags)]
    }
  }

  genContractTypingsFile(contract: Contract, codegenConfig: CodegenConfig): FileDescription {
    return {
      path: join(this.outDirAbs, ...contract.path, `${contract.name}.ts`),
      contents: codegenContractTypings(contract, codegenConfig),
    }
  }

  genContractFactoryFile(contract: Contract, abi: any, bytecode?: BytecodeWithLinkReferences) {
    return {
      path: join(this.outDirAbs, 'factories', ...contract.path, `${contract.name}${FACTORY_POSTFIX}.ts`),
      contents: codegenContractFactory(contract, abi, bytecode),
    }
  }

  afterRun(): FileDescription[] {
    // For each contract that doesn't have bytecode (it's either abstract, or only ABI was provided)
    // generate a simplified factory, that allows to interact with deployed contract instances.
    const abstractFactoryFiles = Object.keys(this.contractCache).map((contractName) => {
      const { contract, abi } = this.contractCache[contractName]!
      return {
        path: join(this.outDirAbs, 'factories', ...contract.path, `${contract.name}${FACTORY_POSTFIX}.ts`),
        contents: codegenAbstractContractFactory(contract, abi),
      }
    })

    const allContracts = this.allFiles.map((x) => normalizeName(getFilename(x)))
    const hardhatHelper =
      this.cfg.flags.environment === 'hardhat'
        ? { path: join(this.outDirAbs, 'hardhat.d.ts'), contents: generateHardhatHelper(allContracts) }
        : undefined

    const allFiles = compact([
      ...abstractFactoryFiles,
      {
        path: join(this.outDirAbs, 'common.ts'),
        contents: readFileSync(join(__dirname, '../static/common.ts'), 'utf-8'),
      },
      ...generateBarrelFiles(this.allFiles, { typeOnly: false }).map((fd) => ({
        path: join(this.outDirAbs, fd.path),
        contents: fd.contents,
      })),
      // @todo barrel files for factories.
      hardhatHelper,
    ])

    return allFiles
  }
}
