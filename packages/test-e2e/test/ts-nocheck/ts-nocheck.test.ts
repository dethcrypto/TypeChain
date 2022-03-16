import { expect } from 'earljs'
import { readFile, remove } from 'fs-extra'
import * as path from 'path'
import { runTypeChain } from 'typechain'

describe('ts-nocheck', () => {
  it('is added to the top of the file, when "tsNocheck" config flag is "true"', async () => {
    await codegen({ tsNocheck: true })

    for (const output of await readOutputs()) {
      expect(output).toEqual(expect.stringMatching('// @ts-nocheck'))
    }
  })

  it('is not added to the file, when "tsNocheck" config flag is "false"', async () => {
    await codegen({ tsNocheck: false })

    for (const output of await readOutputs()) {
      expect(output).not.toEqual(expect.stringMatching('// @ts-nocheck'))
    }
  })

  after(() => remove(path.resolve(__dirname, './out')))
})

async function codegen({ tsNocheck }: { tsNocheck: boolean }) {
  const files = [path.resolve(__dirname, './ts-nocheck.abi.json')]

  // @todo consider virtual filesystem
  await runTypeChain({
    target: 'ethers-v5',
    cwd: __dirname,
    filesToProcess: files,
    allFiles: files,
    outDir: './out',
    flags: {
      alwaysGenerateOverloads: false,
      environment: undefined,

      tsNocheck,
    },
  })
}

const readOutputs = () =>
  Promise.all(
    ['common.ts', 'index.ts', 'TsNocheckAbi.ts', 'factories/TsNocheckAbi__factory.ts'].map(async (file) => {
      const filePath = path.resolve(__dirname, './out', file)
      return await readFile(filePath, 'utf8')
    }),
  )
