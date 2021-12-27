import { expect } from 'earljs'

import {
  EventDeclaration,
  EvmSymbol,
  FunctionDeclaration,
  getFullSignatureAsSymbolForEvent,
  getFullSignatureForEvent,
  getIndexedSignatureForEvent,
  getSignatureForFn,
} from '../../src'

const event1: EventDeclaration = {
  name: 'Deposit',
  isAnonymous: false,
  inputs: [
    { isIndexed: true, type: { type: 'address', originalType: 'address' }, name: 'from' },
    { isIndexed: true, type: { type: 'address', originalType: 'address' }, name: 'to' },
    { isIndexed: false, type: { type: 'integer', bits: 256, originalType: 'uint256' }, name: 'to' },
  ],
}

const fn1: FunctionDeclaration = {
  name: 'transfer',
  inputs: [
    { name: 'to', type: { type: 'address', originalType: 'address' } },
    { name: 'value', type: { type: 'integer', bits: 256, originalType: 'int256' } },
  ],
  outputs: [],
  stateMutability: 'pure',
}

describe('utils > signatures > getFullSignatureAsSymbolForEvent', () => {
  it('works', () => {
    const signature = getFullSignatureAsSymbolForEvent(event1)

    expect(signature).toEqual('Deposit_address_address_uint256')
  })

  it('address[]', () => {
    const struct: EventDeclaration = {
      name: 'Allow',
      isAnonymous: false,
      inputs: [
        {
          name: 'whitelist',
          isIndexed: false,
          type: { type: 'array', itemType: { type: 'address', originalType: 'address' }, originalType: 'address[]' },
        },
      ],
    }

    const signature = getFullSignatureAsSymbolForEvent(struct)

    expect(signature).toEqual('Allow_address_array')
  })
})

describe('utils > signatures > getFullSignatureForEvent', () => {
  it('works', () => {
    const signature = getFullSignatureForEvent(event1)

    expect(signature).toEqual('Deposit(address,address,uint256)')
  })
})

describe('utils > signatures > getIndexedSignatureForEvent', () => {
  it('works', () => {
    const signature = getIndexedSignatureForEvent(event1)

    expect(signature).toEqual('Deposit(address,address)')
  })
})

describe('utils >  signatures > getSignatureForFn', () => {
  it('works', () => {
    const signature = getSignatureForFn(fn1)

    expect(signature).toEqual('transfer(address,int256)')
  })

  it('tuple', () => {
    const struct: EvmSymbol[] = [
      { name: 'number', type: { type: 'uinteger', originalType: 'uint256', bits: 256 } },
      {
        name: 'inner',
        type: {
          type: 'tuple',
          originalType: 'tuple',
          components: [
            { name: 'bool', type: { type: 'boolean', originalType: 'boolean' } },
            {
              name: 'addresses',
              type: {
                type: 'array',
                originalType: 'address[]',
                itemType: { type: 'address', originalType: 'address' },
              },
            },
          ],
        },
      },
    ]
    const fn: FunctionDeclaration = {
      name: 'add',
      inputs: [{ name: 'arg1', type: { type: 'tuple', originalType: 'tuple', components: struct } }],
      outputs: [],
      stateMutability: 'pure',
    }
    const signature = getSignatureForFn(fn)
    expect(signature).toEqual('add((uint256,(boolean,address[])))')
  })

  it('tuple[]', () => {
    const struct: EvmSymbol[] = [
      { name: 'number', type: { type: 'uinteger', originalType: 'uint256', bits: 256 } },
      {
        name: 'inner',
        type: {
          type: 'tuple',
          originalType: 'tuple',
          components: [
            { name: 'bool', type: { type: 'boolean', originalType: 'boolean' } },
            {
              name: 'addresses',
              type: {
                type: 'array',
                originalType: 'address[]',
                itemType: { type: 'address', originalType: 'address' },
              },
            },
          ],
        },
      },
    ]
    const fn: FunctionDeclaration = {
      name: 'add',
      inputs: [
        {
          name: 'arg1',
          type: {
            type: 'array',
            originalType: 'tuple[]',
            itemType: { type: 'tuple', components: struct, originalType: 'tuple' },
          },
        },
      ],
      outputs: [],
      stateMutability: 'pure',
    }
    const signature = getSignatureForFn(fn)
    expect(signature).toEqual('add((uint256,(boolean,address[]))[])')
  })
})
