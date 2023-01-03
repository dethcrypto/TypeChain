import { expect } from 'earljs'
import { join } from 'path'
import { Config } from 'typechain'

import EthersTarget from '../src/index'

describe(EthersTarget.name, () => {
  it('emits types with namespaces relative to input dir', () => {
    const files = [join(__dirname, 'input dir/woop/test-1.abi')]

    const config: Config = {
      cwd: __dirname,
      inputDir: join(__dirname, 'input dir'),
      allFiles: files,
      filesToProcess: files,
      target: 'ethers-v6',
      flags: {
        alwaysGenerateOverloads: false,
        discriminateTypes: false,
        environment: undefined,
      },
    }

    let target = new EthersTarget(config)

    const woopNamespaceImport = expect.stringMatching("import type * as woop from './woop';\n")

    let actual = target.afterRun().map((fd) => fd.contents)

    expect(actual).toBeAnArrayOfLength(5)
    expect(actual).toBeAnArrayWith(woopNamespaceImport)

    target = new EthersTarget({ ...config, inputDir: join(__dirname, 'input dir/woop') })

    actual = target.afterRun().map((fd) => fd.contents)
    expect(actual).toBeAnArrayOfLength(3)
    expect(actual).not.toBeAnArrayWith(woopNamespaceImport)
  })
})
