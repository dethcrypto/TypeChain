import { typedAssert } from 'test-utils'

import type { Overloads } from '../types/v0.6.4/Overloads'
import { createNewBlockchain } from './common'

describe('Overloads', () => {
  const chain = createNewBlockchain<Overloads>('Overloads')

  it('works with 1st overload', async () => {
    typedAssert(await chain.contract['overload1(int256)'](1), BigInt(1))
    typedAssert(await chain.contract['overload1(int256)'].staticCallResult(1), [BigInt(1)])
  })

  it('works with 2n overload', async () => {
    typedAssert(await chain.contract['overload1(uint256,uint256)'](1, 2), BigInt(3))
    typedAssert(await chain.contract['overload1(uint256,uint256)'].staticCallResult(1, 2), [BigInt(3)])
  })
})
