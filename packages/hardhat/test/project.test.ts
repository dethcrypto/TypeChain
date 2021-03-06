/* eslint-disable no-invalid-this */
import { expect } from 'earljs'
import fs from 'fs'

import { useEnvironment } from './helpers'

describe('Integration tests', function () {
  describe('Happy case', function () {
    this.timeout(120_000)
    useEnvironment('hardhat-project')

    beforeEach(async function () {
      await this.hre.run('clean')
    })

    it('Compiles and generates Typechain artifacts', async function () {
      const exists = fs.existsSync(this.hre.config.typechain.outDir)
      expect(exists).toEqual(false)

      await this.hre.run('compile')

      const dir = await fs.promises.readdir(this.hre.config.typechain.outDir)
      expect(dir.length).not.toEqual(0)
    })
  })
})
