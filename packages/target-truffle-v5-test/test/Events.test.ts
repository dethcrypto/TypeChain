import BigNumber from 'bn.js'
import { typedAssert, asyncWithDoneCase } from 'test-utils'

import { EventsInstance, Event3_bool_uint256 } from '../types/truffle-contracts/Events'

const Events = artifacts.require('Events')

contract('Events', ([deployer]) => {
  let c: EventsInstance

  beforeEach(async () => {
    c = await Events.new({ from: deployer })
  })

  describe('Event1', () => {
    it('works with receipts', async () => {
      const response = await c.emit_event1()
      typedAssert(response.logs[0].event, 'Event1')
      typedAssert(response.logs[0].args, {
        value1: new BigNumber(1),
        value2: new BigNumber(2),
        '0': new BigNumber(1),
        '1': new BigNumber(2),
      })
    })

    // c.Event1 doesnt seem to work
    it.skip(
      'works with event emitters',
      asyncWithDoneCase(async (_done) => {
        // c.Event1((_, e) => {
        //   typedAssert(e.name, 'Event1')
        //   typedAssert(e.args, {
        //     value1: new BigNumber(1),
        //     value2: new BigNumber(2),
        //     '0': new BigNumber(1),
        //     '1': new BigNumber(2),
        //   })
        //   done()
        // })
        // await c.emit_event1()
      }),
    )
  })

  describe('Event2', () => {
    it('works', async () => {
      const response = await c.emit_event2()
      typedAssert(response.logs[0].event, 'Event2')
      typedAssert(response.logs[0].args, { '0': new BigNumber(1) })
    })
  })

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
      typedAssert(response.logs[0].args, { value1: new BigNumber(1), '0': new BigNumber(1) })
    })
  })
})
