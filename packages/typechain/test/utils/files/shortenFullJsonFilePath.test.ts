import { expect } from 'earljs'

import { shortenFullJsonFilePath } from '../../../src'

describe(shortenFullJsonFilePath.name, () => {
  it('shortens X.sol/X.json', () => {
    expect(shortenFullJsonFilePath('/A/B/C/X.sol/X.json', [])).toEqual('/A/B/C/X.json')
  })

  it('shortens X/X.abi', () => {
    expect(shortenFullJsonFilePath('/A/B/C/X/X.abi', [])).toEqual('/A/B/C/X.abi')
  })

  it('does not shorten when there is more than one file in a directory', () => {
    const paths = ['/A/B/C/X/X.abi', '/A/B/C/X/Y.abi']

    expect(shortenFullJsonFilePath(paths[0], paths)).toEqual('/A/B/C/X/X.abi')
  })

  it('shortens even when directory has common prefix', () => {
    const paths = ['/A/X/X.abi', '/A/XY/Y.abi']

    expect(shortenFullJsonFilePath(paths[0], paths)).toEqual('/A/X.abi')
  })
})
