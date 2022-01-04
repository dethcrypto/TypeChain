import { expect } from 'earljs'
import { Contract, EventDeclaration, parse, RawAbiDefinition } from 'typechain'

import { codegenContractFactory } from '../src/codegen'
import { generateEventFilters } from '../src/codegen/events'

describe('Ethers generation edge cases', () => {
  const emptyContract: Contract = {
    name: 'TestContract',
    rawName: 'TestContract',
    functions: {},
    events: {},
    structs: {},
    constructor: [{ name: 'constructor', inputs: [], outputs: [], stateMutability: 'nonpayable' }],
  }

  it('should generate simple factory when no bytecode available', () => {
    expect(codegenContractFactory(emptyContract, 'abi', undefined)).toEqual(
      expect.stringMatching(/export class TestContract__factory \{/),
    )
  })

  it('should work when bytecode has linkReferences', () => {
    const source = codegenContractFactory(emptyContract, 'abi', {
      bytecode: '{{BYTECODE}}',
      linkReferences: [{ reference: '{{REFERENCE}}' }],
    })

    expect(source).toEqual(expect.stringMatching(/export class TestContract__factory extends ContractFactory \{/))
    expect(source).toEqual(expect.stringMatching(/static linkBytecode\(/))
  })
})

describe(generateEventFilters.name, () => {
  it('generates proper argument names even if arguments are not named in Solidity', () => {
    const events: EventDeclaration[] = [
      {
        name: 'UpdateFrequencySet',
        isAnonymous: false,
        inputs: [
          {
            name: undefined,
            isIndexed: false,
            type: {
              type: 'array',
              itemType: { type: 'address', originalType: 'address' },
              originalType: 'address[]',
            },
          },
          {
            name: undefined,
            isIndexed: false,
            type: {
              type: 'array',
              itemType: { type: 'uinteger', bits: 256, originalType: 'uint256' },
              originalType: 'uint256[]',
            },
          },
        ],
      },
    ]

    const actual = generateEventFilters(events)

    expect(actual).toEqual(expect.stringMatching('arg0?: null'))
    expect(actual).toEqual(expect.stringMatching('arg1?: null'))
  })

  it('generates argument names from event field names in the ABI', () => {
    const abi = ([
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: true, internalType: 'address', name: 'approved', type: 'address' },
          { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'Approval',
        type: 'event',
      },
    ] as any) as RawAbiDefinition[]

    const contract = parse(abi, 'Rarity')
    const [actual] = Object.values(contract.events).map(generateEventFilters)

    expect(actual).toEqual(expect.stringMatching('owner?: string'))
    expect(actual).toEqual(expect.stringMatching('approved?: string'))
    expect(actual).toEqual(expect.stringMatching('tokenId?: BigNumberish'))
  })
})
