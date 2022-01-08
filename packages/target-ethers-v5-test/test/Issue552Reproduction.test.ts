import { AssertTrue, IsExact } from 'test-utils'

import { Issue552Observer, Issue552Reproduction } from '../types/Issue552Reproduction'
import { createNewBlockchain, deployContract } from './common'

describe('Issue552Reproduction', () => {
  it('does not emit overly long tuples', () => {
    type _ = [
      AssertTrue<
        IsExact<Issue552Reproduction.ObservationParamsStruct['observations'], Issue552Observer.ObservationStruct[]>
      >,
      AssertTrue<
        IsExact<
          Issue552Reproduction.ObservationParamsStructOutput['observations'],
          Issue552Observer.ObservationStructOutput[]
        >
      >,
    ]
  })

  it('accepts array of numbers', async () => {
    const { signer, ganache } = await createNewBlockchain()

    try {
      const contract = await deployContract<Issue552Reproduction>(signer, 'Issue552_Reproduction')

      await contract.input([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    } finally {
      ganache.close()
    }
  })
})
