/* eslint-disable no-invalid-this */
import { expect } from 'earljs'
import { join } from 'path'
import { existsSync, promises as fsPromises, copyFileSync } from 'fs'

import { useEnvironment } from './helpers'

describe('Typechain x Hardhat', function () {
  this.timeout(120_000)
  useEnvironment('hardhat-project')

  beforeEach(async function () {
    await this.hre.run('clean')
  })

  it('compiles and generates typings', async function () {
    const exists = existsSync(this.hre.config.typechain.outDir)
    expect(exists).toEqual(false)

    await this.hre.run('compile')

    const dir = await fsPromises.readdir(this.hre.config.typechain.outDir)
    expect(dir.length).not.toEqual(0)
  })

  it('doesnt generate typings with --no-typechain ', async function () {
    const exists = existsSync(this.hre.config.typechain.outDir)
    expect(exists).toEqual(false)

    await this.hre.run('compile', { noTypechain: true })

    expect(existsSync(this.hre.config.typechain.outDir)).toEqual(false)
  })

  describe('when recompiling', () => {
    it.only('generates typings only for changed files', async function () {
      const exists = existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      await this.hre.run('compile')
      const contractDir = join(__dirname, 'fixture-projects/hardhat-project/contracts')
      const fixtureFilesDir = join(__dirname, 'fixture-files')
      copyFileSync(join(fixtureFilesDir, 'TestContract2.sol'), join(contractDir, 'TestContract2.sol'))
      await this.hre.run('compile')

      expect(existsSync(this.hre.config.typechain.outDir)).toEqual(true)
    })
  })
})
