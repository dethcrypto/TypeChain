import { readFileSync } from 'fs'
import { join, relative, resolve } from 'path'
import {
  Config,
  detectInputsRoot,
  extractAbi,
  extractDocumentation,
  FileDescription,
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
  private readonly inputsRoot: string

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

    const path = relative(this.inputsRoot, file.path)
    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, path, documentation)

    return {
      path: join(this.outDirAbs, ...contract.path, `${contract.name}.ts`),
      contents: codegen(contract),
    }
  }

  override afterRun(): FileDescription[] {
    return [
      {
        path: join(this.outDirAbs, 'types.ts'),
        contents: readFileSync(join(__dirname, '../static/types.ts'), 'utf-8'),
      },
    ]
  }
}
