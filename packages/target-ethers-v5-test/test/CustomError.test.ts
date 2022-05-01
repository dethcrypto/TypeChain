import { BigNumber, ethers } from 'ethers'
import { AssertTrue, IsExact, typedAssert } from 'test-utils'

// import type { TypedCustomEvent } from '../types/common'

import type {
    CustomError
} from '../types/v0.8.9/CustomError'
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

  it.only('typed event import', async () => {
      try {
        const foo = await contract.callStatic.transfer('0x0000000000000000000000000000000000000000', 1)

        console.log('in here')
      } catch (err) {
          console.log(err)
          console.log(Object.keys(err as any))
      }
    // const filter = contract.errors.Event1(null, null)
    // const results = (await contract.queryFilter(filter)) as any

    // const results2 = results as Event1Event[]
    // results2.map((r) => {
    //   typedAssert(r.args.value1, BigNumber.from(1))
    //   typedAssert(r.args.value2, BigNumber.from(2))
    //   typedAssert(r.args[0], BigNumber.from(1))
    //   typedAssert(r.args[1], BigNumber.from(2))
    // })
  })

})
