import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { solidity } from 'ethereum-waffle'
import { ethers } from 'hardhat'

import type { Counter } from '../typechain-types'

chai.use(solidity)
chai.use(chaiAsPromised)
const { expect } = chai

describe('Counter', () => {
  let counter: Counter

  beforeEach(async () => {
    // 1
    const signers = await ethers.getSigners()

    // 2
    counter = await ethers.deployContract('Counter')

    const initialCount = await counter.getCount()

    // 3
    expect(initialCount).to.eq(0)
    expect(await counter.getAddress()).to.properAddress
  })

  // 4
  describe('count up', async () => {
    it('should count up', async () => {
      await counter.countUp()
      const count = await counter.getCount()
      expect(count).to.eq(1)
    })
  })

  describe('count down', async () => {
    // 5
    it('should fail due to underflow exception', () => {
      return expect(counter.countDown()).to.eventually.be.rejectedWith(Error, 'Uint256 underflow')
    })

    it('should count down', async () => {
      await counter.countUp()

      await counter.countDown()
      const count = await counter.getCount()
      expect(count).to.eq(0)
    })
  })
})
