import { BaseContract } from 'ethers'

export const reservedKeywords = new Set([
  'then',
  ...Object.getOwnPropertyNames(BaseContract.prototype), // for methods
  ...Object.keys(new BaseContract('0x', [])), // for readOnly properties
])
