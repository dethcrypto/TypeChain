import { BigNumber, ethers } from 'ethers'
import { AssertTrue, IsExact, typedAssert } from 'test-utils'

import type { TypedEventFilter } from '../types/common'
import type { Event1Event, Event1EventFilter, Event3_bool_uint256_Event, Events } from '../types/v0.6.4/Events'
import { createNewBlockchain, deployContract } from './common'

describe('Events', () => {
  const chain = createNewBlockchain<Events>('Events')

  let contract!: Events

  beforeEach(async () => {
    contract = chain.contract
    const { signer } = chain

    signer.provider.pollingInterval = 100
    contract = await deployContract<Events>(signer, 'Events')
  })

  afterEach(async () => {
    contract.removeAllListeners('Event1')
  })

  it('queryFilter', async () => {
    await contract.emit_event1()

    const filter = contract.filters.Event1(null, null)
    const results = await contract.queryFilter(filter)
    results.map((r) => {
      typedAssert(r.args.value1, BigNumber.from(1))
      typedAssert(r.args.value2, BigNumber.from(2))
      typedAssert(r.args[0], BigNumber.from(1))
      typedAssert(r.args[1], BigNumber.from(2))
    })
  })

  it('queryFilter without params', async () => {
    await contract.emit_event1()

    const filter = contract.filters.Event1()

    const results = await contract.queryFilter(filter)
    results.map((r) => {
      typedAssert(r.args.value1, BigNumber.from(1))
      typedAssert(r.args.value2, BigNumber.from(2))
      typedAssert(r.args[0], BigNumber.from(1))
      typedAssert(r.args[1], BigNumber.from(2))
    })
  })

  it('contract.on', async () => {
    const filter = contract.filters.Event1(null, null)
    await contract.queryFilter(filter)

    type _ = AssertTrue<IsExact<GetEventFromFilter<typeof filter>, Event1Event>>
    type __ = AssertTrue<IsExact<typeof filter, Event1EventFilter>>

    contract.on(filter, (a, b, c) => {
      typedAssert(a, BigNumber.from(1))
      typedAssert(b, BigNumber.from(2))
      const args = [a, b] as [ethers.BigNumber, ethers.BigNumber] & {
        value1: ethers.BigNumber
        value2: ethers.BigNumber
      }
      args.value1 = a
      args.value2 = b
      typedAssert(c.args, args)
    })

    await contract.emit_event1()
    await new Promise((r) => setTimeout(r, 1000))
  })

  it('contract.once', async () => {
    const filter = contract.filters.Event1(null, null)
    await contract.queryFilter(filter)

    contract.once(filter, (a, b, c) => {
      typedAssert(a, BigNumber.from(1))
      typedAssert(b, BigNumber.from(2))
      const args = [a, b] as [ethers.BigNumber, ethers.BigNumber] & {
        value1: ethers.BigNumber
        value2: ethers.BigNumber
      }
      args.value1 = a
      args.value2 = b
      typedAssert(c.args, args)
    })

    await contract.emit_event1()
    await new Promise((r) => setTimeout(r, 1000))
  })

  it('typed event import', async () => {
    const filter = contract.filters.Event1(null, null)
    const results = (await contract.queryFilter(filter)) as any

    const results2 = results as Event1Event[]
    results2.map((r) => {
      typedAssert(r.args.value1, BigNumber.from(1))
      typedAssert(r.args.value2, BigNumber.from(2))
      typedAssert(r.args[0], BigNumber.from(1))
      typedAssert(r.args[1], BigNumber.from(2))
    })
  })

  it('queryFilter overloaded event', async () => {
    await contract.emit_event3_overloaded()
    {
      const filterA = contract.filters['Event3(bool,uint256)']()

      type _ = AssertTrue<IsExact<GetEventFromFilter<typeof filterA>, Event3_bool_uint256_Event>>

      const results = await contract.queryFilter(filterA)
      results.map((r) => {
        typedAssert(r.args.value1, true)
        typedAssert(r.args.value2, BigNumber.from(2))
        typedAssert(r.args[0], true)
        typedAssert(r.args[1], BigNumber.from(2))
      })
    }
    {
      const filterB = contract.filters['Event3(uint256)']()
      const results = await contract.queryFilter(filterB)
      results.map((r) => {
        typedAssert(r.args.value1, BigNumber.from(1))
        typedAssert(r.args[0], BigNumber.from(1))
      })
    }
  })
})

type GetEventFromFilter<TFilter extends TypedEventFilter<any>> = TFilter extends TypedEventFilter<infer E> ? E : never
