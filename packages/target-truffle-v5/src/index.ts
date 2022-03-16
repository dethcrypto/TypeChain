import { readFileSync } from 'fs'
import { join, relative, resolve } from 'path'
import {
  Config,
  Contract,
  detectInputsRoot,
  extractAbi,
  extractDocumentation,
  FileDescription,
  parse,
  shortenFullJsonFilePath,
  TypeChainTarget,
} from 'typechain'

import { codegenArtifactHeaders } from './codegen'
import { codegenContract } from './codegen/contracts'

export interface ITruffleCfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/truffle-contracts/'

export default class Truffle extends TypeChainTarget {
  name = 'Truffle'

  private readonly outDirAbs: string
  private readonly inputsRoot: string
  private contracts: Contract[] = []

  constructor(config: Config) {
    super(config)

    const { cwd, outDir, allFiles } = config

    this.inputsRoot = detectInputsRoot(allFiles)
    this.outDirAbs = resolve(cwd, outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: FileDescription): FileDescription | void {
    const abi = extractAbi(file.contents)
    const isEmptyAbi = abi.length === 0
    if (isEmptyAbi) {
      return
    }

    const path = relative(this.inputsRoot, shortenFullJsonFilePath(file.path, this.cfg.allFiles))
    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, path, documentation)

    this.contracts.push(contract)

    return {
      path: join(this.outDirAbs, ...contract.path, `${contract.name}.d.ts`),
      contents: codegenContract(contract),
    }
  }

  override afterRun(): FileDescription[] {
    return [
      {
        path: join(this.outDirAbs, 'index.d.ts'),
        contents: codegenArtifactHeaders(this.contracts),
      },
      {
        path: join(this.outDirAbs, 'types.d.ts'),
        contents: readFileSync(join(__dirname, '../static/types.d.ts'), 'utf-8'),
      },
    ]
  }
}
