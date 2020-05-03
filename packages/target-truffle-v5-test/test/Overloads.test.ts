import BigNumber from 'bn.js'
import { typedAssert } from 'test-utils'

import { OverloadsInstance } from '../types/truffle-contracts/Overloads'

const Overloads = artifacts.require('Overloads')

contract('Overloads', ([deployer]) => {
  let c: OverloadsInstance

  beforeEach(async () => {
    c = await Overloads.new({ from: deployer })
  })

  it('works with 1st overload', async () => {
    const result = await c.methods['overload1(int256)'](1)
    typedAssert(result, new BigNumber('1'))
  })

  it('works with 2n overload', async () => {
    const result = await c.methods['overload1(uint256,uint256)'](1, 2)
    typedAssert(result, new BigNumber('3'))
  })
})
