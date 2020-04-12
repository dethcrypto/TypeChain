import BigNumber from 'bignumber.js'
import { typedAssert } from 'test-utils'

import { EventsInstance } from '../types/truffle-contracts/Events'

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

  // NOTE: events with nameless args like Event2 doesnt work
})
