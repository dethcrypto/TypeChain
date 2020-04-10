import { Contract, getFilename, extractAbi, parse } from 'typechain'
import { TsGeneratorPlugin, TContext, TFileDesc } from 'ts-generator'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'

import { codegen, generateArtifactHeaders } from './codegen'

export interface ITruffleCfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/truffle-contracts/'

export default class Truffle extends TsGeneratorPlugin {
  name = 'Truffle'

  private readonly outDirAbs: string
  private contracts: Contract[] = []

  constructor(ctx: TContext<ITruffleCfg>) {
    super(ctx)

    const { cwd, rawConfig } = ctx

    this.outDirAbs = resolve(cwd, rawConfig.outDir || DEFAULT_OUT_PATH)
  }

  transformFile(file: TFileDesc): TFileDesc | void {
    const abi = extractAbi(file.contents)
    const isEmptyAbi = abi.length === 0
    if (isEmptyAbi) {
      return
    }

    const name = getFilename(file.path)

    const contract = parse(abi, name)

    this.contracts.push(contract)
  }

  afterRun(): TFileDesc[] {
    return [
      {
        path: join(this.outDirAbs, 'index.d.ts'),
        contents: codegen(this.contracts),
      },
      {
        path: join(this.outDirAbs, 'merge.d.ts'),
        contents: generateArtifactHeaders(this.contracts),
      },
      {
        path: join(this.outDirAbs, 'types.d.ts'),
        contents: readFileSync(join(__dirname, './static/types.d.ts'), 'utf-8'),
      },
    ]
  }
}
