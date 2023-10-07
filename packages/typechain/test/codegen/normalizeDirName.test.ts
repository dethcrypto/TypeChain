import { expect } from 'earljs'

import { normalizeDirName } from '../../src/codegen/normalizeDirName'

describe('dir name normalizer', () => {
  it('should work', () => {
    expect(normalizeDirName('dirname')).toEqual('dirname')
    expect(normalizeDirName('dir_name')).toEqual('dirName')
    expect(normalizeDirName('0.4.24')).toEqual('_0424')
    expect(normalizeDirName('0-4-24')).toEqual('_0424')
    expect(normalizeDirName('0424')).toEqual('_0424')
    expect(normalizeDirName('0dir-name.1')).toEqual('_0DirName1')
  })
})
