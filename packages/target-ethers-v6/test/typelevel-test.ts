// eslint-disable-next-line import/no-extraneous-dependencies
import { AssertTrue, IsExact } from 'test-utils'

import { TypedContractEvent, TypedEventLog, TypedListener } from '../static/common'

export type TransferEvent = TypedContractEvent<
  [string, string, number],
  [string, string, number],
  { from: string; to: string; tokenId: number }
>

type _ = AssertTrue<
  IsExact<
    Parameters<TypedListener<TransferEvent>>,
    [string, string, number, TypedEventLog<TransferEvent>, ...undefined[]]
  >
>
