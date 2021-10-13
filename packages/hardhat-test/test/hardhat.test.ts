import { ethers } from 'hardhat'
import { AssertTrue, IsExact } from 'test-utils'

import { Counter__factory } from '../typechain'

describe('TypeChain x Hardhat', () => {
  it.skip('should infer correct contract factory type', async () => {
    const counterFactory = await ethers.getContractFactory('Counter')

    type _ = AssertTrue<IsExact<typeof counterFactory, Counter__factory>>
  })
})
