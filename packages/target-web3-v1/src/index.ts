import { readFileSync } from 'fs'
import { join, resolve } from 'path'
import {
  Config,
  extractAbi,
  extractDocumentation,
  FileDescription,
  getFilename,
  parse,
  TypeChainTarget,
} from 'typechain'

import { codegen } from './codegen'

export interface IWeb3Cfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/web3-v1-contracts/'

export default class Web3V1 extends TypeChainTarget {
  name = 'Web3-v1'

  private readonly outDirAbs: string

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

    return {
      path: join(this.outDirAbs, `${name}.d.ts`),
      contents: codegen(contract),
    }
  }

  afterRun(): FileDescription[] {
    return [
      {
        path: join(this.outDirAbs, 'types.d.ts'),
        contents: readFileSync(join(__dirname, '../static/types.d.ts'), 'utf-8'),
      },
    ]
  }
}
