import { typeCase, typedAssert } from 'test-utils'

import type { Payable } from '../types/v0.6.4/Payable'
import { createNewBlockchain } from './common'

describe('Payable', () => {
  const chain = createNewBlockchain<Payable>('Payable')

  it('allows to specify value when expected', async () => {
    const { contract, accounts } = chain
    const result = await contract.methods.payable_func().send({ value: 1, from: accounts[0] })
    typedAssert(result.transactionIndex, 0)
  })

  it(
    '[TYPE ONLY] disallows to specify value when expected',
    typeCase(async () => {
      const { contract, accounts } = chain

      await contract.methods.non_payable_func().send({
        // @ts-expect-error: value shouldn't be here
        value: 1,
        from: accounts[0],
      })
    }),
  )
})
