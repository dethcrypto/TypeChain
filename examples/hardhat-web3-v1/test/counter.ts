import BN from 'bn.js'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { artifacts, web3 } from 'hardhat'

import type { Counter } from '../typechain-types'

chai.use(chaiAsPromised)
const { expect } = chai

describe('Counter', () => {
  let counter: Counter
  beforeEach(async () => {
    // 1
    const { abi } = await artifacts.readArtifact('Counter');
    counter = new web3.eth.Contract(abi) as unknown as Counter

    // 2
    const initialCount = web3.utils.toBN(await counter.methods.getCount().call());

    // 3
    expect(initialCount.eq(new BN(0)))
  })

  // 4
  describe('count up', async () => {
    it('should count up', async () => {
      await counter.methods.countUp().call()
      const count = web3.utils.toBN(await counter.methods.getCount().call());
      expect(count.eq(new BN(1)))
    })
  })

  describe('count down', async () => {
    // 5
    it('should fail due to underflow exception', () => {
      return expect(counter.methods.countDown().call()).to.eventually.be.rejectedWith(Error, 'Uint256 underflow')
    })

    it('should count down', async () => {
      await counter.methods.countUp().call()

      await counter.methods.countDown().call()
      const count = web3.utils.toBN(await counter.methods.getCount().call());
      expect(count.eq(new BN(0)))
    })
  })
})
