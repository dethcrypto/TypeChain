import {
  getFullSignatureAsSymbolForEvent,
  EventDeclaration,
  getFullSignatureForEvent,
  getIndexedSignatureForEvent,
} from '../../src'
import { expect } from 'chai'

const event1: EventDeclaration = {
  name: 'Deposit',
  isAnonymous: false,
  inputs: [
    { isIndexed: true, type: { type: 'address', originalType: 'address' }, name: 'from' },
    { isIndexed: true, type: { type: 'address', originalType: 'address' }, name: 'to' },
    { isIndexed: false, type: { type: 'integer', bits: 256, originalType: 'uint256' }, name: 'to' },
  ],
}

describe('utils > signatures > getFullSignatureAsSymbolForEvent', () => {
  it('works', () => {
    const signature = getFullSignatureAsSymbolForEvent(event1)

    expect(signature).to.be.eq('Deposit_address_address_uint256')
  })
})

describe('utils > signatures > getFullSignatureForEvent', () => {
  it('works', () => {
    const signature = getFullSignatureForEvent(event1)

    expect(signature).to.be.eq('Deposit(address,address,uint256)')
  })
})

describe('utils > signatures > getIndexedSignatureForEvent', () => {
  it('works', () => {
    const signature = getIndexedSignatureForEvent(event1)

    expect(signature).to.be.eq('Deposit(address,address)')
  })
})
