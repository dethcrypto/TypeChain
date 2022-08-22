import BN from 'bn.js'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { artifacts, contract } from 'hardhat'

// chai.use(solidity);
chai.use(chaiAsPromised).should()
const { expect } = chai

import { CounterContract, CounterInstance } from '../typechain-types'
const Counter: CounterContract = artifacts.require('Counter')

contract('Counter', (accounts: string[]) => {
  let counter: CounterInstance

  beforeEach(async () => {
    // 1
    counter = await Counter.new()
    // 2
    const initialCount = await counter.getCount()

    // 3
    expect(initialCount.eq(new BN(0)))

    // 1 with given address
    counter = await Counter.at(counter.address)
  })

  // 4
  describe('count up', async () => {
    it('should count up', async () => {
      await counter.countUp()
      const count = await counter.getCount()
      expect(count.eq(new BN(1)))
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
      expect(count.eq(new BN(0)))
    })
  })
})
