import { createNewBlockchain, deployContract, typeCase } from './common'
import { Payable } from '../types/Payable'
import Web3 from 'web3'

describe('Payable', () => {
  let contract: Payable
  let web3: Web3
  let accounts: string[]

  beforeEach(async () => {
    ;({ web3, accounts } = await createNewBlockchain())
    contract = await deployContract<Payable>(web3, accounts, 'Payable')
  })

  it('allows to specify value when expected', async () => {
    await contract.methods.payable_func().send({ value: 1, from: accounts[0] })
  })

  it(
    '[TYPE ONLY] disallows to specify value when expected',
    typeCase(async () => {
      // @ts-expect-error: value shouldn't be here
      await contract.methods.non_payable_func().send({ value: 1, from: accounts[0] })
    }),
  )
})
