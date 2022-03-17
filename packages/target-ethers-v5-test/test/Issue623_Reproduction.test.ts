import { expect } from 'earljs'
import { BigNumber } from 'ethers'
import type { AssertTrue, IsExact } from 'test-utils'

import type { Issue623_Reproduction } from '../types/v0.8.9/Issue623_Reproduction'
import { createNewBlockchain } from './common'

describe('Issue623_Reproduction', () => {
  const chain = createNewBlockchain<Issue623_Reproduction>('Issue623_Reproduction')

  it('event.values is property not array method', async () => {
    const { contract } = chain

    const expected = [BigNumber.from(0), BigNumber.from(1), BigNumber.from(2)]

    await contract.createProposal()

    const results = await contract.queryFilter(contract.filters.ProposalCreated())

    const [values1] = results[0].args

    expect(values1).toEqual(expected)

    type _ = AssertTrue<IsExact<() => IterableIterator<BigNumber[]>, typeof results[number]['args']['values']>>

    const [values2] = Array.from(results[0].args.values())

    expect(values2).toEqual(expected)
  })
})
