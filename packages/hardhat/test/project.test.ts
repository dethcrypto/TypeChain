/* eslint-disable no-invalid-this */
import { expect, Mock, mockFn } from 'earljs'
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
    let originalConsoleLog: any
    let consoleLogMock: Mock<any, any>

    beforeEach(() => {
      consoleLogMock = mockFn().returns(undefined)
      originalConsoleLog = console.log
      console.log = consoleLogMock
    })

    afterEach(() => {
      console.log = originalConsoleLog
    })

    it('generates typings only for changed files', async function () {
      const exists = existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      await this.hre.run('compile')
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 11 typings!'])

      // copy one more file and recompile project
      copyFileSync(TestContract2OriginPath, TestContract2DestinationPath)
      await this.hre.run('compile')

      expect(existsSync(this.hre.config.typechain.outDir)).toEqual(true)
      expect(readFileSync(typechainIndexFilePath, 'utf-8')).toMatchSnapshot()
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 5 typings!']) // 4 b/c commons.ts, hardhat.d.ts, index.ts, TestContract2 and TestContract2Factory
    })

    it('does nothing when there are no changes to recompile', async function () {
      const exists = existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      await this.hre.run('compile')
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 11 typings!'])

      await this.hre.run('compile')

      expect(existsSync(this.hre.config.typechain.outDir)).toEqual(true)
      expect(consoleLogMock).toHaveBeenCalledWith(['No need to generate any newer typings.'])
    })

    it('does full recompile when forced', async function () {
      const exists = existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      await this.hre.run('compile')
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 11 typings!'])

      await this.hre.run('typechain')

      expect(existsSync(this.hre.config.typechain.outDir)).toEqual(true)
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 11 typings!'])
    })

    it('generates typing for external artifacts', async function () {
      const exists = existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      this.hre.config.typechain.externalArtifacts = ['externalArtifacts/*.json']

      await this.hre.run('compile')
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 5 typings for external artifacts!'])

      await this.hre.run('compile')
      expect(consoleLogMock).toHaveBeenCalledWith(['Successfully generated 5 typings for external artifacts!'])
    })
  })
})

const contractDir = join(__dirname, 'fixture-projects/hardhat-project/contracts')
const fixtureFilesDir = join(__dirname, 'fixture-files')
const TestContract2OriginPath = join(fixtureFilesDir, 'TestContract2.sol')
const TestContract2DestinationPath = join(contractDir, 'TestContract2.sol')
const typechainIndexFilePath = join(__dirname, 'fixture-projects/hardhat-project/typechain/index.ts')
