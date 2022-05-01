import { BigNumber, ethers } from 'ethers'
import { AssertTrue, IsExact, typedAssert } from 'test-utils'

import type { CustomError } from '../types/v0.8.9/CustomError'
import { createNewBlockchain, deployContract } from './common'

describe('CustomError support', () => {
  const chain = createNewBlockchain<CustomError>('CustomError')

  let contract!: CustomError

  beforeEach(async () => {
    contract = chain.contract
    const { signer } = chain

    signer.provider.pollingInterval = 100
    contract = await deployContract<CustomError>(signer, 'CustomError')
  })

  afterEach(async () => {
  })

  it('typed error import', async () => {
      try {
        await contract.callStatic.transfer('0x0000000000000000000000000000000000000000', 1)
      } catch (err) {
        const expectedError = contract.interface.errors['InsufficientBalance(uint256,uint256,uint256)']
        console.log(expectedError)
        console.log(err)
        // TODO: still wip on how to best consume the errors here
        // if(err.reason !== expectedError.)
      }
  })
})
