import { AssertTrue, IsExact, typedAssert } from 'test-utils'

import type { TypedDeferredTopicFilter, TypedEventLog } from '../types/common'
import type { Event1Event, Event3_bool_uint256_Event, Events } from '../types/v0.6.4/Events'
import { createNewBlockchain, deployContract } from './common'

describe('Events', () => {
  const chain = createNewBlockchain<Events>('Events')

  let contract!: Events

  beforeEach(async () => {
    contract = chain.contract
    const { signer, provider } = chain

    provider.pollingInterval = 100
    contract = await deployContract<Events>(signer, 'Events')
  })

  afterEach(async () => {
    await contract.removeAllListeners()
  })

  it('queryFilter', async () => {
    await contract.emit_event1()

    const event = contract.getEvent('Event1')

    const results = await contract.queryFilter(event)
    results.map((r) => {
      typedAssert(r.args.value1, BigInt(1))
      typedAssert(r.args.value2, BigInt(2))
      typedAssert(r.args[0], BigInt(1))
      typedAssert(r.args[1], BigInt(2))
    })
  })

  it('queryFilter without params', async () => {
    await contract.emit_event1()

    const filter = contract.filters.Event1()

    const results = await contract.queryFilter(filter)
    results.map((r) => {
      typedAssert(r.args.value1, BigInt(1))
      typedAssert(r.args.value2, BigInt(2))
      typedAssert(r.args[0], BigInt(1))
      typedAssert(r.args[1], BigInt(2))
    })
  })

  it('queryFilter ith tuples and arrays', async () => {
    await contract.emit_event5()

    const filter = contract.filters.Event5()
    const results = await contract.queryFilter(filter)
    typedAssert(results.length, 1)
    results.map((r) => {
      typedAssert(r.args[0][0][0], BigInt(2))
      typedAssert(r.args[0][0][1], 'test')
      typedAssert(r.args[0][1][0], BigInt(3))
      typedAssert(r.args[0][1][1], 'test2')
    })
  })

  it('contract.on', async () => {
    const filter = contract.filters.Event1(undefined, undefined)
    await contract.queryFilter(filter)
    type _ = AssertTrue<IsExact<GetEventFromFilter<typeof filter>, Event1Event.Event>>
    type __ = AssertTrue<IsExact<typeof filter, Event1Event.Filter>>

    const result = await contract.on(filter, (a, b, c) => {
      typedAssert(a, BigInt(1))
      typedAssert(b, BigInt(2))
      const args = [a, b] as [bigint, bigint] & {
        value1: bigint
        value2: bigint
      }
      args.value1 = a
      args.value2 = b
      typedAssert(c.args, args)
    })
    typedAssert(result, contract)

    await contract.emit_event1()

    await contract.off(filter)
  })

  it('contract.once', async () => {
    const filter = contract.filters.Event1(undefined, undefined)
    await contract.queryFilter(filter)

    const result = await contract.once(filter, (a, b, c) => {
      typedAssert(a, BigInt(1))
      typedAssert(b, BigInt(2))
      const args = [a, b] as [bigint, bigint] & {
        value1: bigint
        value2: bigint
      }
      args.value1 = a
      args.value2 = b
      typedAssert(c.args, args)
    })
    typedAssert(result, contract)

    await contract.emit_event1()

    await contract.off(filter)
  })

  it('typed event import', async () => {
    const filter = contract.filters.Event1()
    const results = (await contract.queryFilter(filter)) as any

    const results2 = results as TypedEventLog<Event1Event.Event>[]
    results2.map((r) => {
      typedAssert(r.args.value1, BigInt(1))
      typedAssert(r.args.value2, BigInt(2))
      typedAssert(r.args[0], BigInt(1))
      typedAssert(r.args[1], BigInt(2))
    })
  })

  it('queryFilter overloaded event', async () => {
    await contract.emit_event3_overloaded()
    {
      const filterA = contract.filters['Event3(bool,uint256)']()

      type _1 = AssertTrue<IsExact<GetEventFromFilter<typeof filterA>, Event3_bool_uint256_Event.Event>>
      type _2 = AssertTrue<IsExact<Event3_bool_uint256_Event.OutputObject, { value1: boolean; value2: bigint }>>

      const results = await contract.queryFilter(filterA)
      results.map((r) => {
        typedAssert(r.args.value1, true)
        typedAssert(r.args.value2, BigInt(2))
        typedAssert(r.args[0], true)
        typedAssert(r.args[1], BigInt(2))
      })
    }
    {
      const filterB = contract.filters['Event3(uint256)']()
      const results = await contract.queryFilter(filterB)
      results.map((r) => {
        typedAssert(r.args.value1, BigInt(1))
        typedAssert(r.args[0], BigInt(1))
      })
    }
  })
})

type GetEventFromFilter<TFilter extends TypedDeferredTopicFilter<any>> = TFilter extends TypedDeferredTopicFilter<
  infer E
>
  ? E
  : never
