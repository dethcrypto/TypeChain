import { BigNumberish, EventDescription, FunctionDescription } from 'ethers/utils'

export class TransactionOverrides {
  nonce?: BigNumberish | Promise<BigNumberish>
  gasLimit?: BigNumberish | Promise<BigNumberish>
  gasPrice?: BigNumberish | Promise<BigNumberish>
  value?: BigNumberish | Promise<BigNumberish>
  chainId?: number | Promise<number>
}

export interface TypedEventDescription<T extends Pick<EventDescription, 'encodeTopics'>> extends EventDescription {
  encodeTopics: T['encodeTopics']
}

export interface TypedFunctionDescription<T extends Pick<FunctionDescription, 'encode'>> extends FunctionDescription {
  encode: T['encode']
}
