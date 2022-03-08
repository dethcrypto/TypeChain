import { expect } from 'earljs'
import { BigNumber } from 'ethers'
import { typedAssert } from 'test-utils'

import type { Overloads } from '../types/v0.6.4/Overloads'
import { createNewBlockchain, deployContract } from './common'

describe('Overloads', () => {
  let contract: Overloads
  let ganache: any
  beforeEach(async () => {
    const { ganache: _ganache, signer } = await createNewBlockchain()
    ganache = _ganache
    contract = await deployContract<Overloads>(signer, 'Overloads')
  })

  afterEach(() => ganache.close())

  it('works with 1st overload', async () => {
    typedAssert(await contract['overload1(int256)'](1), BigNumber.from(1))
    typedAssert(await contract.functions['overload1(int256)'](1), [BigNumber.from(1)])
  })

  it('still doesnt create overload1 fn anymore', () => {
    // this is exepcted error as there is no index signature anymore on Contract
    // @ts-expect-error
    expect(contract.overload1).toEqual(undefined)
  })

  it('works with 2n overload', async () => {
    typedAssert(await contract['overload1(uint256,uint256)'](1, 2), BigNumber.from(3))
    typedAssert(await contract.functions['overload1(uint256,uint256)'](1, 2), [BigNumber.from(3)])
  })
})
