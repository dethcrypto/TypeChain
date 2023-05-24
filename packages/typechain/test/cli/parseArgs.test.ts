import { expect, mockFn } from 'earljs'

import { parseArgs } from '../../src/cli/parseArgs'

describe('cli > parseArgs', () => {
  let prevArgs: string[]
  beforeEach(() => {
    prevArgs = process.argv
  })
  afterEach(() => {
    process.argv = prevArgs
  })

  it('parses minimal set of args', () => {
    process.argv = ['', '', '--target', 'sample-target']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['**/*.abi'],
      target: 'sample-target',
      outDir: undefined,
      inputDir: undefined,
      flags: { alwaysGenerateOverloads: false, tsNocheck: false, discriminateTypes: false, node16Modules: false },
    })
  })

  it('parses a single file or glob', () => {
    process.argv = ['', '', '--target', 'sample-target', '*.abi']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['*.abi'],
      target: 'sample-target',
      outDir: undefined,
      inputDir: undefined,
      flags: { alwaysGenerateOverloads: false, tsNocheck: false, discriminateTypes: false, node16Modules: false },
    })
  })

  it('parses multiple files', () => {
    process.argv = ['', '', '--target', 'sample-target', '*.json', '**/*.json']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['*.json', '**/*.json'],
      target: 'sample-target',
      outDir: undefined,
      inputDir: undefined,
      flags: { alwaysGenerateOverloads: false, tsNocheck: false, discriminateTypes: false, node16Modules: false },
    })
  })

  it('works with different flags', () => {
    process.argv = ['', '', '--target', 'sample-target', '--always-generate-overloads', '--discriminate-types']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['**/*.abi'],
      target: 'sample-target',
      outDir: undefined,
      inputDir: undefined,
      flags: { alwaysGenerateOverloads: true, tsNocheck: false, discriminateTypes: true, node16Modules: false },
    })
  })

  it('shows usage guide given --help flag', () => {
    process.argv = ['', '', '--help']

    const processExit = process.exit
    // eslint-disable-next-line no-console
    const consoleLog = console.log

    const exitMock = mockFn<typeof process.exit>(() => {
      throw new Error('process.exit called')
    })
    process.exit = exitMock
    const logMock = mockFn<typeof console.log>(() => {})
    // eslint-disable-next-line no-console
    console.log = logMock

    expect(parseArgs).toThrow('process.exit called')

    expect(exitMock).toHaveBeenCalledWith([0])
    const logged = logMock.calls[0].args[0] as string

    for (const substring of ['Options', '--out-dir', '--target', 'Example Usage']) {
      expect(logged).toEqual(expect.stringMatching(substring))
    }

    process.exit = processExit
    // eslint-disable-next-line no-console
    console.log = consoleLog
  })

  it('parses --ts-nocheck flag', () => {
    process.argv = ['', '', '--target', 'sample-target', '--ts-nocheck']

    let res = parseArgs()

    expect(res.flags.tsNocheck).toEqual(true)

    process.argv = ['', '', '--target', 'sample-target']

    res = parseArgs()

    expect(res.flags.tsNocheck).toEqual(false)
  })
})
