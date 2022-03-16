import { readFileSync } from 'fs'
import { join, relative, resolve } from 'path'
import {
  Config,
  createBarrelFiles,
  detectInputsRoot,
  extractAbi,
  extractDocumentation,
  FileDescription,
  normalizeSlashes,
  parse,
  shortenFullJsonFilePath,
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

    const path = relative(this.inputsRoot, shortenFullJsonFilePath(file.path, this.cfg.allFiles))
    const documentation = extractDocumentation(file.contents)

    const contract = parse(abi, path, documentation)

    return {
      path: join(this.outDirAbs, ...contract.path, `${contract.name}.ts`),
      contents: codegen(contract),
    }
  }

  override afterRun(): FileDescription[] {
    const { allFiles } = this.cfg

    const barrels = createBarrelFiles(
      allFiles
        .map((p) => shortenFullJsonFilePath(p, allFiles))
        .map((p) => relative(this.inputsRoot, p))
        .map(normalizeSlashes),
      {
        typeOnly: true,
      },
    ).map((fd) => ({
      path: join(this.outDirAbs, fd.path),
      contents: fd.contents,
    }))

    return [
      {
        path: join(this.outDirAbs, 'types.ts'),
        contents: readFileSync(join(__dirname, '../static/types.ts'), 'utf-8'),
      },
      ...barrels,
    ]
  }
}
