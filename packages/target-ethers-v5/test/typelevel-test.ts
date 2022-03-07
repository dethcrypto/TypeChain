import { AssertTrue, IsExact } from 'test-utils'

import { OnEvent, TypedEvent, TypedEventFilter } from '../static/common'

export type TransferEvent = TypedEvent<[string, string, number], { from: string; to: string; tokenId: number }>

declare const filter: TypedEventFilter<TransferEvent>

declare const onEvent: OnEvent<void>

onEvent(filter, (...args) => {
  type _ = AssertTrue<IsExact<typeof args, [string, string, number, TransferEvent]>>
})
