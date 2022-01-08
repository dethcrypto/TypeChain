import { expect } from 'earljs'

import {
  ArrayType,
  BytesType,
  extractStructNameIfAvailable,
  IntegerType,
  parseEvmType,
  StructName,
  UnsignedIntegerType,
} from '../../src/parser/parseEvmType'

describe('parseEvmType function', () => {
  it('parses unsigned integer', () => {
    const parsedType = parseEvmType('uint8')

    expect(parsedType.type).toEqual('uinteger')
    expect((parsedType as UnsignedIntegerType).bits).toEqual(8)
  })

  it('parses signed integer', () => {
    const parsedType = parseEvmType('int')

    expect(parsedType.type).toEqual('integer')
    expect((parsedType as IntegerType).bits).toEqual(256)
  })

  it('parses boolean', () => {
    const parsedType = parseEvmType('bool')

    expect(parsedType.type).toEqual('boolean')
  })

  it('parses bytes2', () => {
    const parsedType = parseEvmType('bytes2')

    expect(parsedType.type).toEqual('bytes')
    expect((parsedType as BytesType).size).toEqual(2)
  })

  it('parses bytes', () => {
    const parsedType = parseEvmType('bytes')

    expect(parsedType.type).toEqual('dynamic-bytes')
  })

  it('parses arrays', () => {
    const parsedType = parseEvmType('uint[]')

    expect(parsedType.type).toEqual('array')
    expect((parsedType as ArrayType).itemType.type).toEqual('uinteger')
  })

  it('parses fixed size arrays', () => {
    const parsedType = parseEvmType('uint[8]')

    expect(parsedType.type).toEqual('array')
    expect((parsedType as ArrayType).itemType.type).toEqual('uinteger')
    expect((parsedType as ArrayType).size).toEqual(8)
  })

  it('parses nested arrays', () => {
    const parsedType = parseEvmType('uint16[8][256]')

    expect(parsedType.type).toEqual('array')
    expect((parsedType as ArrayType).itemType.type).toEqual('array')
    expect((parsedType as ArrayType).size).toEqual(256)
    expect(((parsedType as ArrayType).itemType as ArrayType).itemType.type).toEqual('uinteger')
    expect(((parsedType as ArrayType).itemType as ArrayType).size).toEqual(8)
    expect((((parsedType as ArrayType).itemType as ArrayType).itemType as UnsignedIntegerType).bits).toEqual(16)
  })

  it('parses tuples', () => {
    const parsedType = parseEvmType('tuple', [
      {
        name: 'uint256_0',
        type: { type: 'uinteger', bits: 256, originalType: 'uint256' },
      },
      {
        name: 'uint256_1',
        type: { type: 'uinteger', bits: 256, originalType: 'uint256' },
      },
    ])
    expect(parsedType).toEqual({
      type: 'tuple',
      components: [
        { name: 'uint256_0', type: { type: 'uinteger', bits: 256, originalType: 'uint256' } },
        { name: 'uint256_1', type: { type: 'uinteger', bits: 256, originalType: 'uint256' } },
      ],
      originalType: 'tuple',
    })
  })

  it('parses struct tuples', () => {
    const parsedType = parseEvmType(
      'tuple',
      [
        { name: 'target', type: { type: 'address', originalType: 'address' } },
        { name: 'callData', type: { type: 'dynamic-bytes', originalType: 'bytes' } },
      ],
      'struct Multicall.Call',
    )
    expect(parsedType).toLooseEqual({
      type: 'tuple',
      components: [
        { name: 'target', type: { type: 'address', originalType: 'address' } },
        { name: 'callData', type: { type: 'dynamic-bytes', originalType: 'bytes' } },
      ],
      originalType: 'tuple',
      structName: { identifier: 'Call', namespace: 'Multicall' },
    })
  })

  it('parses struct array', () => {
    const parsedType = parseEvmType(
      'tuple[]',
      [
        { name: 'target', type: { type: 'address', originalType: 'address' } },
        { name: 'callData', type: { type: 'dynamic-bytes', originalType: 'bytes' } },
      ],
      'struct Multicall.Call[]',
    )
    expect(parsedType).toLooseEqual({
      type: 'array',
      itemType: {
        type: 'tuple',
        components: [
          { name: 'target', type: { type: 'address', originalType: 'address' } },
          { name: 'callData', type: { type: 'dynamic-bytes', originalType: 'bytes' } },
        ],
        originalType: 'tuple',
      },
      originalType: 'tuple[]',
      structName: { identifier: 'Call', namespace: 'Multicall' },
    })
  })

  it('parses struct nested array', () => {
    const parsedType = parseEvmType(
      'tuple[][]',
      [
        { name: 'target', type: { type: 'address', originalType: 'address' } },
        { name: 'callData', type: { type: 'dynamic-bytes', originalType: 'bytes' } },
      ],
      'struct Multicall.Call[][]',
    )
    expect(parsedType).toLooseEqual({
      type: 'array',
      itemType: {
        type: 'array',
        itemType: {
          type: 'tuple',
          components: [
            { name: 'target', type: { type: 'address', originalType: 'address' } },
            { name: 'callData', type: { type: 'dynamic-bytes', originalType: 'bytes' } },
          ],
          originalType: 'tuple',
        },
        originalType: 'tuple[]',
      },
      originalType: 'tuple[][]',
      structName: { identifier: 'Call', namespace: 'Multicall' },
    })
  })

  it('parses constant size struct arrays', () => {
    const actual = parseEvmType(
      'tuple[2]',
      [
        { name: 'x', type: { originalType: 'uint256', type: 'uinteger', bits: 256 } },
        { name: 'y', type: { originalType: 'uint256', type: 'uinteger', bits: 256 } },
      ],
      'struct Vector2[2]',
    )
    expect(actual).toLooseEqual({
      structName: { identifier: 'Vector2' },
      type: 'array',
      originalType: 'tuple[2]',
      size: 2,
      itemType: {
        type: 'tuple',
        originalType: 'tuple',
        components: [
          { name: 'x', type: { originalType: 'uint256', type: 'uinteger', bits: 256 } },
          { name: 'y', type: { originalType: 'uint256', type: 'uinteger', bits: 256 } },
        ],
      },
    })
  })

  // Turns out that USUALLY solidity won't leave enums in abis but for some reason they are part of libraries abis
  // This is a test for workaround that forces it to parse as uint8
  // Related issue: https://github.com/ethereum-ts/TypeChain/issues/216
  it('parses enums in libraries', () => {
    const parsedType = parseEvmType('Lib.BOOL', undefined, 'enum Lib.BOOL')

    expect(parsedType.type).toEqual('uinteger')
    expect((parsedType as UnsignedIntegerType).bits).toEqual(8)
  })

  it('parses contracts in libraries', () => {
    const parsedType = parseEvmType('SomeContract', undefined, 'contract SomeContract')

    expect(parsedType.type).toEqual('address')
  })

  it('returns "unknown" type on unknown parse', () => {
    const parsedType = parseEvmType('DummyUnparsable', undefined, 'Something random unparsable')

    expect(parsedType.type).toEqual('unknown')
  })

  it('preserves namespace name', () => {
    const abi = {
      components: [],
      internalType: 'struct KingOfTheHill.Bid',
      type: 'tuple',
    }

    const actual = parseEvmType(abi.type, abi.components, abi.internalType)

    expect(actual).toLooseEqual(expect.objectWith({ structName: new StructName('Bid', 'KingOfTheHill') }))
  })
})

describe('extractStructNameIfAvailable', () => {
  it('works with namespaced structs', () => {
    const actual = extractStructNameIfAvailable('struct KingOfTheHill.Bid')
    expect(actual).toLooseEqual({ namespace: 'KingOfTheHill', identifier: 'Bid' })
    expect(actual?.toString()).toEqual('KingOfTheHill.Bid')
  })

  it('works with free floating structs', () => {
    expect(extractStructNameIfAvailable('struct aa')).toLooseEqual({ identifier: 'Aa' })
  })

  it('returns undefined when string does not start with "struct "', () => {
    expect(extractStructNameIfAvailable('not a struct')).toEqual(undefined)
  })
})
