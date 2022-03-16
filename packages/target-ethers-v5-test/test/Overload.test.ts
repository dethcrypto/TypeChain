import { expect } from 'earljs'
import { BigNumber } from 'ethers'
import { typedAssert } from 'test-utils'

import type { Overloads } from '../types/v0.6.4/Overloads'
import { createNewBlockchain } from './common'

describe('Overloads', () => {
  const chain = createNewBlockchain<Overloads>('Overloads')

  it('works with 1st overload', async () => {
    typedAssert(await chain.contract['overload1(int256)'](1), BigNumber.from(1))
    typedAssert(await chain.contract.functions['overload1(int256)'](1), [BigNumber.from(1)])
  })

  it('still doesnt create overload1 fn anymore', () => {
    // this is exepcted error as there is no index signature anymore on Contract
    // @ts-expect-error
    expect(chain.contract.overload1).toEqual(undefined)
  })

  it('works with 2n overload', async () => {
    typedAssert(await chain.contract['overload1(uint256,uint256)'](1, 2), BigNumber.from(3))
    typedAssert(await chain.contract.functions['overload1(uint256,uint256)'](1, 2), [BigNumber.from(3)])
  })
})
