import type { Interface } from '@ethersproject/abi'
import { ethers } from 'hardhat'
import type { AssertTrue, IsExact } from 'test-utils'

import { Counter__factory, StructsInConstructor__factory } from '../typechain-types'
import type { Vector2Struct } from '../typechain-types/StructsInConstructor'

describe('TypeChain x Hardhat', () => {
  it.skip('should infer correct contract factory type', async () => {
    const counterFactory = await ethers.getContractFactory('Counter')

    type _1 = AssertTrue<IsExact<typeof counterFactory, Counter__factory>>

    type DeployArgs = Parameters<StructsInConstructor__factory['deploy']>
    type _2 = AssertTrue<IsExact<DeployArgs[0], [Vector2Struct, Vector2Struct]>>
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
