import { BigNumberish, EventDescription, FunctionDescription } from 'ethers/utils'

export interface TransactionOverrides {
  gasLimit?: BigNumberish | Promise<BigNumberish>
  gasPrice?: BigNumberish | Promise<BigNumberish>
  maxPriorityFeePerGas?: BigNumberish | Promise<BigNumberish>
  maxFeePerGas?: BigNumberish | Promise<BigNumberish>
  nonce?: BigNumberish | Promise<BigNumberish>
  value?: BigNumberish | Promise<BigNumberish>
  from?: string | Promise<string>
  chainId?: number | Promise<number>
}

export interface TypedEventDescription<T extends Pick<EventDescription, 'encodeTopics'>> extends EventDescription {
  encodeTopics: T['encodeTopics']
}

export interface TypedFunctionDescription<T extends Pick<FunctionDescription, 'encode'>> extends FunctionDescription {
  encode: T['encode']
}
