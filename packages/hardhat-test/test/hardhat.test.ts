import { Interface } from '@ethersproject/abi'
import { ethers } from 'hardhat'
import { AssertTrue, IsExact } from 'test-utils'

import { Counter__factory } from '../typechain-types'

describe('TypeChain x Hardhat', () => {
  it.skip('should infer correct contract factory type', async () => {
    const counterFactory = await ethers.getContractFactory('Counter')

    type _ = AssertTrue<IsExact<typeof counterFactory, Counter__factory>>
  })

  it('should construct factories in different ways', async () => {
    const [deployer] = await ethers.getSigners()
    const artifact = require('../artifacts/contracts/Counter.sol/Counter.json') as { abi: Interface; bytecode: string }

    const counterFactory1 = new Counter__factory()
    const counterFactory2 = new Counter__factory(deployer)
    const counterFactory3 = new Counter__factory(artifact.abi, artifact.bytecode)
    const counterFactory4 = new Counter__factory(artifact.abi, artifact.bytecode, deployer)
  })
})
