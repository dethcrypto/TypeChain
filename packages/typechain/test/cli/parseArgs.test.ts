import { expect } from 'earljs'

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
      flags: { alwaysGenerateOverloads: false },
    })
  })

  it('parses a single file or glob', () => {
    process.argv = ['', '', '--target', 'sample-target', '*.abi']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['*.abi'],
      target: 'sample-target',
      outDir: undefined,
      flags: { alwaysGenerateOverloads: false },
    })
  })

  it('parses multiple files', () => {
    process.argv = ['', '', '--target', 'sample-target', '*.json', '**/*.json']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['*.json', '**/*.json'],
      target: 'sample-target',
      outDir: undefined,
      flags: { alwaysGenerateOverloads: false },
    })
  })

  it('parses --always-generate-overloads flag', () => {
    process.argv = ['', '', '--target', 'sample-target', '--always-generate-overloads']

    const res = parseArgs()

    expect(res).toEqual({
      files: ['**/*.abi'],
      target: 'sample-target',
      outDir: undefined,
      flags: { alwaysGenerateOverloads: true },
    })
  })
})
