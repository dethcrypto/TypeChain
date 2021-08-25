import BigNumber from 'bignumber.js'
import { typedAssert } from 'test-utils'

import { Event3_bool_uint256, EventsInstance } from '../types/truffle-contracts/Events'

const Events = artifacts.require('Events')

contract('Events', ([deployer]) => {
  let c: EventsInstance

  beforeEach(async () => {
    c = await Events.new({ from: deployer })
  })

  describe('Event1', () => {
    it('works', async () => {
      const response = await c.emit_event1()
      typedAssert(response.logs[0].event, 'Event1')
      typedAssert(response.logs[0].args, { value1: new BigNumber(1), value2: new BigNumber(2) })
    })
  })

  // NOTE: events with nameless args like Event2 doesnt work with truffle AT ALL

  describe('Event3 (overloaded)', () => {
    it('works', async () => {
      const response = await c.emit_event3()
      typedAssert(response.logs[0].event, 'Event3')
      typedAssert(((response.logs[0].args as any) as Event3_bool_uint256['args']).value1, true)
      typedAssert(((response.logs[0].args as any) as Event3_bool_uint256['args']).value2, new BigNumber(2))
    })

    it('works for overload', async () => {
      const response = await c.emit_event3_overloaded()
      typedAssert(response.logs[0].event, 'Event3')
      typedAssert(response.logs[0].args, { value1: new BigNumber(1) })
    })
  })

  describe('EIP1559 overrides', () => {
    it('works', async () => {
      await c.emit_event1({
        maxFeePerGas: new BigNumber('1'),
        maxPriorityFeePerGas: new BigNumber('1'),
      })
      // doesn't throw error
    })
  })
})
