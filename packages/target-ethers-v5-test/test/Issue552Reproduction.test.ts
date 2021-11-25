import { AssertTrue, IsExact } from 'test-utils'

import * as types from '../types/Issue552Reproduction'
import { createNewBlockchain, deployContract } from './common'

describe('Issue552Reproduction', () => {
  it('does not emit overly long tuples', () => {
    type _ = [
      AssertTrue<IsExact<types.ObservationParamsStruct['observations'], types.ObservationStruct[]>>,
      AssertTrue<IsExact<types.ObservationParamsStructOutput['observations'], types.ObservationStructOutput[]>>,
    ]
  })

  it('accepts array of numbers', async () => {
    const { signer, ganache } = await createNewBlockchain()

    try {
      const contract = await deployContract<types.Issue552Reproduction>(signer, 'Issue552_Reproduction')

      await contract.input([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    } finally {
      ganache.close()
    }
  })
})
