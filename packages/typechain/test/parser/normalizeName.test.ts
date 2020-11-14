import { expect } from 'earljs'

import { normalizeName } from '../../src/parser/normalizeName'

describe('name normalizer', () => {
  it('should work', () => {
    expect(normalizeName('DsToken')).toEqual('DsToken')
    expect(normalizeName('test')).toEqual('Test')
    expect(normalizeName('ds-token')).toEqual('DsToken')
    expect(normalizeName('ds_token')).toEqual('DsToken')
    expect(normalizeName('ds token')).toEqual('DsToken')
    expect(normalizeName('name.abi')).toEqual('NameAbi')
    expect(normalizeName('1234name.abi')).toEqual('NameAbi')
    expect(normalizeName('ERC20.abi')).toEqual('ERC20Abi')
  })
})
