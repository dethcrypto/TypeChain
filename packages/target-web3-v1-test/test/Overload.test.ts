import { typedAssert } from 'test-utils'
import type Web3 from 'web3'

import type { Overloads } from '../types/v0.6.4/Overloads'
import { createNewBlockchain, deployContract } from './common'

describe('Overloads', () => {
  let contract: Overloads
  let web3: Web3
  let accounts: string[]

  beforeEach(async () => {
    ;({ web3, accounts } = await createNewBlockchain())
    contract = await deployContract<Overloads>(web3, accounts, 'Overloads')
  })

  it('works with 1st overload', async () => {
    const result = await contract.methods['overload1(int256)'](1).call()
    typedAssert(result, '1')
  })

  it('works with 2n overload', async () => {
    const result = await contract.methods['overload1(uint256,uint256)'](1, 2).call()
    typedAssert(result, '3')
  })
})
