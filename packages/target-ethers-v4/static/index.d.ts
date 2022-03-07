import { BigNumberish, EventDescription, FunctionDescription } from 'ethers/utils'

export interface TypedEventDescription<T extends Pick<EventDescription, 'encodeTopics'>> extends EventDescription {
  encodeTopics: T['encodeTopics']
}

export interface TypedFunctionDescription<T extends Pick<FunctionDescription, 'encode'>> extends FunctionDescription {
  encode: T['encode']
}
