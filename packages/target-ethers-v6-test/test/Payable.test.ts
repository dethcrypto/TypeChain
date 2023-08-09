import type { AssertTrue, IsExact } from 'test-utils'

import type { Payable } from '../types'
import type { PostfixOverrides } from '../types/common'
import { createNewBlockchain } from './common'

describe('Payable', () => {
  const chain = createNewBlockchain<Payable>('Payable')

  it('generate view override parameter types for staticCall', async () => {
    type InputType = Parameters<typeof chain.contract.payable_func.staticCall>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<InputType, PostfixOverrides<[], 'view'>>>
  })

  it('generate view override parameter types for staticCallResult', async () => {
    type InputType = Parameters<typeof chain.contract.payable_func.staticCallResult>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<InputType, PostfixOverrides<[], 'view'>>>
  })
})
