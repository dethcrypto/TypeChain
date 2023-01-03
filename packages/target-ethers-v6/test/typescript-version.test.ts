/* eslint-disable no-console */
import { expect, Mock, mockFn } from 'earljs'
import proxyquire from 'proxyquire'

describe('Ethers target constructor', () => {
  const consoleError = console.error
  let consoleErrorMock: Mock.Of<typeof console.error>

  beforeEach(() => {
    consoleErrorMock = mockFn<typeof console.error>(() => {})
    console.error = consoleErrorMock
  })

  afterEach(() => {
    console.error = consoleError
  })

  it('panics when TypeScript version is lower than 4.3', () => {
    const mod = proxyquire('../src', {
      typescript: { version: '4.2' },
      '../package.json': { version: '1.2.3' },
    }) as typeof import('../src')

    const { default: EthersTarget } = mod

    expect(() => {
      const _ = new EthersTarget({
        flags: { alwaysGenerateOverloads: false, discriminateTypes: false, environment: 'hardhat' },
        filesToProcess: ['woop'],
        inputDir: '',
        cwd: '',
        allFiles: ['woop'],
        target: 'ethers-v6',
      })
    }).toThrow('@typechain/ethers-v6 1.2.3 needs TypeScript version 4.3 or newer.')

    const message = consoleErrorMock.calls[0].args[0]

    expect(message).toEqual(expect.stringMatching('@typechain/ethers-v6 1.2.3 needs TypeScript version 4.3 or newer.'))
    expect(message).toEqual(
      expect.stringMatching('Generated code will cause syntax errors in older TypeScript versions.'),
    )
    expect(message).toEqual(expect.stringMatching('Your TypeScript version is 4.2.'))
  })

  it('works when TypeScript version is 4.3 or newer', () => {
    for (const version of ['4.3.0', '4.4.0']) {
      const mod = proxyquire('../src', { typescript: { version } }) as typeof import('../src')

      const { default: EthersTarget } = mod

      expect(() => {
        const _ = new EthersTarget({
          flags: { alwaysGenerateOverloads: false, discriminateTypes: false, environment: 'hardhat' },
          filesToProcess: ['woop'],
          inputDir: '',
          cwd: '',
          allFiles: ['woop'],
          target: 'ethers-v6',
        })
      }).not.toThrow()

      expect(consoleErrorMock.calls).toEqual([])
    }
  })
})
