/* eslint-disable no-invalid-this */
import { expect } from 'earljs'
import { join } from 'path'
import { existsSync, promises as fsPromises, copyFileSync, readFileSync } from 'fs'

import { useEnvironment } from './helpers'
import rimraf from 'rimraf'

describe('Typechain x Hardhat', function () {
  this.timeout(120_000)
  useEnvironment('hardhat-project')

  beforeEach(async function () {
    await await this.hre.run('clean')
    rimraf.sync(TestContract2DestinationPath)
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
    it('generates typings only for changed files', async function () {
      const exists = existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      await this.hre.run('compile')
      copyFileSync(TestContract2OriginPath, TestContract2DestinationPath)
      await this.hre.run('compile')

      expect(existsSync(this.hre.config.typechain.outDir)).toEqual(true)
      expect(readFileSync(typechainIndexFilePath, 'utf-8')).toMatchSnapshot()
    })

    it('does nothing when there are no changes to recompile')
  })
})

const contractDir = join(__dirname, 'fixture-projects/hardhat-project/contracts')
const fixtureFilesDir = join(__dirname, 'fixture-files')
const TestContract2OriginPath = join(fixtureFilesDir, 'TestContract2.sol')
const TestContract2DestinationPath = join(contractDir, 'TestContract2.sol')
const typechainIndexFilePath = join(__dirname, 'fixture-projects/hardhat-project/typechain/index.ts')
