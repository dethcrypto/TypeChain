import { join, resolve } from 'path'
import { readFileSync } from 'fs'

import { TsGeneratorPlugin, TContext, TFileDesc } from 'ts-generator'
import { extractAbi, parse, getFilename } from 'typechain'

import { codegen } from './codegen'

export interface IWeb3Cfg {
  outDir?: string
}

const DEFAULT_OUT_PATH = './types/web3-v1-contracts/'

export default class Web3V1 extends TsGeneratorPlugin {
  name = 'Web3-v1'

  private readonly outDirAbs: string

  constructor(ctx: TContext<IWeb3Cfg>) {
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

    return {
      path: join(this.outDirAbs, `${name}.d.ts`),
      contents: codegen(contract),
    }
  }

  afterRun(): TFileDesc[] {
    return [
      {
        path: join(this.outDirAbs, 'types.d.ts'),
        contents: readFileSync(join(__dirname, './static/types.d.ts'), 'utf-8'),
      },
    ]
  }
}
