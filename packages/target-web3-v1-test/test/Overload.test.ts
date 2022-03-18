import { typedAssert } from 'test-utils'

import type { Overloads } from '../types/v0.6.4/Overloads'
import { createNewBlockchain } from './common'

describe('Overloads', () => {
  const chain = createNewBlockchain<Overloads>('Overloads')

  it('works with 1st overload', async () => {
    const result = await chain.contract.methods['overload1(int256)'](1).call()
    typedAssert(result, '1')
  })

  it('works with 2n overload', async () => {
    const result = await chain.contract.methods['overload1(uint256,uint256)'](1, 2).call()
    typedAssert(result, '3')
  })
})
