import { typedAssert } from 'test-utils'

import { ERC20 } from '../types'
import { createNewBlockchain, deployContract, getTokenName } from './common'

describe('Generics', () => {
  let contract: ERC20
  let ganache: any
  beforeEach(async () => {
    const { ganache: _ganache, signer } = await createNewBlockchain()
    ganache = _ganache
    contract = await deployContract<ERC20>(signer, 'ERC20', 'Generic ERC20', 'GERC20')
  })

  afterEach(() => ganache.close())

  it('can be used with type generics', async () => {
    typedAssert(await getTokenName(contract), 'Generic ERC20')
  })
})
