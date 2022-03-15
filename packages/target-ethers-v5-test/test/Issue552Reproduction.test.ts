import type { AssertTrue, IsExact } from 'test-utils'

import type { Issue552_Observer, Issue552_Reproduction } from '../types/v0.8.9/Issue552_Reproduction'
import { createNewBlockchain, deployContract } from './common'

describe('Issue552Reproduction', () => {
  it('does not emit overly long tuples', () => {
    type _ = [
      AssertTrue<
        IsExact<Issue552_Reproduction.ObservationParamsStruct['observations'], Issue552_Observer.ObservationStruct[]>
      >,
      AssertTrue<
        IsExact<
          Issue552_Reproduction.ObservationParamsStructOutput['observations'],
          Issue552_Observer.ObservationStructOutput[]
        >
      >,
    ]
  })

  it('accepts array of numbers', async () => {
    const { signer, ganache } = await createNewBlockchain()

    try {
      const contract = await deployContract<Issue552_Reproduction>(signer, 'Issue552_Reproduction')

      await contract.input([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    } finally {
      await ganache.close()
    }
  })
})
