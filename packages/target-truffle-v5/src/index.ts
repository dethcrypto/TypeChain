import {
  Contract,
  extractDocumentation,
  getFilename,
  extractAbi,
  parse,
  TypeChainTarget,
  Config,
  FileDescription,
} from 'typechain'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'

import { codegenArtifactHeaders } from './codegen'
import { codegenContract } from './codegen/contracts'

export interface ITruffleCfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/truffle-contracts/'

export default class Truffle extends TypeChainTarget {
  name = 'Truffle'

  private readonly outDirAbs: string
  private contracts: Contract[] = []

  constructor(config: Config) {
    super(config)

    const { cwd, outDir } = config

    this.outDirAbs = resolve(cwd, outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: FileDescription): FileDescription | void {
    const abi = extractAbi(file.contents)
    const isEmptyAbi = abi.length === 0
    if (isEmptyAbi) {
      return
    }

    const name = getFilename(file.path)
    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, name, documentation)

    this.contracts.push(contract)

    return {
      path: join(this.outDirAbs, `${contract.name}.d.ts`),
      contents: codegenContract(contract),
    }
  }

  afterRun(): FileDescription[] {
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
