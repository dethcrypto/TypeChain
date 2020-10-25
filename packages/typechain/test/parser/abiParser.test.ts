import { expect } from 'earljs'
import { merge } from 'lodash'

import { MalformedAbiError } from '../../src/utils/errors'
import {
  BytecodeLinkReference,
  ensure0xPrefix,
  extractAbi,
  extractBytecode,
  extractDocumentation,
  FunctionDeclaration,
  isConstant,
  isConstantFn,
  parse,
  parseEvent,
  RawAbiDefinition,
  RawEventAbiDefinition,
} from '../../src/parser/abiParser'

describe('extractAbi', () => {
  it('should throw error on not JSON ABI', () => {
    const inputJson = `abc`
    expect(() => extractAbi(inputJson)).toThrow(MalformedAbiError, 'Not a json')
  })

  it('should throw error on malformed ABI', () => {
    const inputJson = `{ "someProps": "abc" }`
    expect(() => extractAbi(inputJson)).toThrow(MalformedAbiError, 'Not a valid ABI')
  })

  it('should work with simple abi', () => {
    const inputJson = `[
      {
        "name": "piece",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [],
        "type": "function"
      }
    ]
    `
    expect(extractAbi(inputJson)).toEqual([
      {
        name: 'piece',
        constant: false,
        payable: false,
        inputs: [],
        outputs: [],
        type: 'function',
      },
    ])
  })

  it('should work with nested abi (truffle style)', () => {
    const inputJson = `{ "abi": [
      {
        "name": "piece",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [],
        "type": "function"
      }
    ]
     }`
    expect(extractAbi(inputJson)).toEqual([
      {
        name: 'piece',
        constant: false,
        payable: false,
        inputs: [],
        outputs: [],
        type: 'function',
      },
    ])
  })

  it('should work with nested abi (@0x/solc-compiler style)', () => {
    const inputJson = `{ "compilerOutput": { "abi": [
      {
        "name": "piece",
        "constant": false,
        "payable": false,
        "inputs": [],
        "outputs": [],
        "type": "function"
      }
    ]
     } }`
    expect(extractAbi(inputJson)).toEqual([
      {
        name: 'piece',
        constant: false,
        payable: false,
        inputs: [],
        outputs: [],
        type: 'function',
      },
    ])
  })
})

describe('extractBytecode', () => {
  const sampleBytecode = '1234abcd'
  const resultBytecode = { bytecode: ensure0xPrefix(sampleBytecode) }

  it('should return bytecode for bare bytecode string', () => {
    expect(extractBytecode(sampleBytecode)).toEqual(resultBytecode)
  })

  it('should return bytecode for bare bytecode with 0x prefix', () => {
    expect(extractBytecode(resultBytecode.bytecode)).toEqual(resultBytecode)
  })

  it('should return undefined for non-bytecode non-json input', () => {
    expect(extractBytecode('surely-not-bytecode')).toEqual(undefined)
  })

  it('should return undefined for simple abi without bytecode', () => {
    expect(extractBytecode(`[{ "name": "piece" }]`)).toEqual(undefined)
  })

  it('should return undefined for nested abi without bytecode', () => {
    expect(extractBytecode(`{ "abi": [{ "name": "piece" }] }`)).toEqual(undefined)
  })

  it('should return bytecode from nested abi (truffle style)', () => {
    expect(extractBytecode(`{ "bytecode": "${sampleBytecode}" }`)).toEqual(resultBytecode)
  })

  it('should return bytecode from nested abi (ethers style)', () => {
    const inputJson = `{ "evm": { "bytecode": { "object": "${sampleBytecode}" }}}`
    expect(extractBytecode(inputJson)).toEqual(resultBytecode)
  })

  it('should return bytecode from nested abi (@0x/sol-compiler style)', () => {
    expect(
      extractBytecode(`{ "compilerOutput": { "evm": { "bytecode": { "object": "${sampleBytecode}" } } } }`),
    ).toEqual(resultBytecode)
  })

  it('should return undefined when nested abi bytecode is malformed', () => {
    expect(extractBytecode(`{ "bytecode": "surely-not-bytecode" }`)).toEqual(undefined)
  })
})

describe('extractDocumentation', () => {
  const devUserDoc = `{
    "devdoc": {
      "author" : "Larry A. Gardner",
      "details" : "All function calls are currently implemented without side effects",
      "methods" :
      {
        "age(uint256)" :
        {
          "author" : "Mary A. Botanist",
          "details" : "The Alexandr N. Tetearing algorithm could increase precision",
          "params" :
          {
            "rings" : "The number of rings from dendrochronological sample"
          },
          "return" : "age in years, rounded up for partial years"
        }
      },
      "title" : "A simulator for trees"
    },
    "userdoc": {
      "methods" :
      {
        "age(uint256)" :
        {
          "notice" : "Calculate tree age in years, rounded up, for live trees"
        }
      },
      "notice" : "You can use this contract for only the most basic simulation"
    }
  }`

  const userDoc = `{
    "userdoc": {
      "methods" :
      {
        "age(uint256)" :
        {
          "notice" : "Calculate tree age in years, rounded up, for live trees"
        }
      },
      "notice" : "You can use this contract for only the most basic simulation"
    }
  }`

  it('should merge devdoc and userdoc', () => {
    const doc = extractDocumentation(devUserDoc)

    expect(doc).toEqual({
      author: 'Larry A. Gardner',
      details: 'All function calls are currently implemented without side effects',
      methods: {
        'age(uint256)': {
          author: 'Mary A. Botanist',
          details: 'The Alexandr N. Tetearing algorithm could increase precision',
          notice: 'Calculate tree age in years, rounded up, for live trees',
          params: { rings: 'The number of rings from dendrochronological sample' },
          return: 'age in years, rounded up for partial years',
        },
      },
      notice: 'You can use this contract for only the most basic simulation',
      title: 'A simulator for trees',
    })
  })

  it('should parse userdoc only', () => {
    const doc = extractDocumentation(userDoc)

    expect(doc).toEqual({
      methods: { 'age(uint256)': { notice: 'Calculate tree age in years, rounded up, for live trees' } },
      notice: 'You can use this contract for only the most basic simulation',
    })
  })
})

describe('extractBytecode with link references', () => {
  // tslint:disable:max-line-length
  const linkRef1: BytecodeLinkReference = { reference: '__./ContractWithLibrary.sol:TestLibrar__' }
  const bytecodeStr1 = `565b005b60005481565b73${linkRef1.reference}63b7203ec673${linkRef1.reference}63b7203ec6846040518263ffffffff167c010000`
  const linkRef2: BytecodeLinkReference = { reference: '__TestLibrary___________________________' }
  const bytecodeObj2 = {
    bytecode: `0x565b005b60005481565b73${linkRef2.reference}63b7203ec673${linkRef2.reference}63b7203ec6846040518263ffffffff167c010000`,
  }
  const linkRef3: BytecodeLinkReference = { reference: '__$17aeeb93c354b782f3950a7152e030370b$__' }
  const bytecodeObj3 = {
    evm: {
      bytecode: {
        object: `0x565b005b60005481565b73${linkRef3.reference}63b7203ec673${linkRef3.reference}63b7203ec6846040518263ffffffff167c010000`,
      },
    },
  }
  const linkRef4: BytecodeLinkReference = {
    reference: linkRef3.reference,
    name: 'ContractWithLibrary.sol:TestLibrary',
  }
  const bytecodeObj4 = {
    evm: {
      bytecode: {
        linkReferences: {
          'ContractWithLibrary.sol': {
            TestLibrary: [
              { length: 20, start: 151 },
              { length: 20, start: 177 },
            ],
          },
        },
        object: bytecodeObj3.evm.bytecode.object,
      },
    },
  }
  const bytecodeObj5 = {
    compilerOutput: bytecodeObj4,
  }

  // tslint:enable

  it('should extract solc 0.4 link references', () => {
    expect(extractBytecode(bytecodeStr1)).toEqual({
      bytecode: `0x${bytecodeStr1}`,
      linkReferences: [linkRef1],
    })
  })

  it('should extract bare library contract name link references', () => {
    expect(extractBytecode(JSON.stringify(bytecodeObj2))).toEqual({
      bytecode: bytecodeObj2.bytecode,
      linkReferences: [linkRef2],
    })
  })

  it('should extract solc 0.5 link references', () => {
    expect(extractBytecode(JSON.stringify(bytecodeObj3))).toEqual({
      bytecode: bytecodeObj3.evm.bytecode.object,
      linkReferences: [linkRef3],
    })
  })

  it('should extract solc 0.5 link references with contract names', () => {
    expect(extractBytecode(JSON.stringify(bytecodeObj4))).toEqual({
      bytecode: bytecodeObj4.evm.bytecode.object,
      linkReferences: [linkRef4],
    })
  })

  it('should handle extracting link references in (@0x/sol-compiler) style', () => {
    expect(extractBytecode(JSON.stringify(bytecodeObj5))).toEqual({
      bytecode: bytecodeObj5.compilerOutput.evm.bytecode.object,
      linkReferences: [linkRef4],
    })
  })

  it('should still extract solc 0.5 link references when plain bytecode is also present', () => {
    const bytecodeObj4a = {
      ...bytecodeObj4,
      bytecode: bytecodeObj4.evm.bytecode.object,
    }
    expect(extractBytecode(JSON.stringify(bytecodeObj4a))).toEqual({
      bytecode: bytecodeObj4.evm.bytecode.object,
      linkReferences: [linkRef4],
    })
  })
})

describe('ensure0xPrefix', () => {
  it("should prepend 0x when it's missing", () => {
    expect(ensure0xPrefix('1234')).toEqual('0x1234')
  })

  it('should return string unchanged when it has 0x prefix', () => {
    expect(ensure0xPrefix('0x1234')).toEqual('0x1234')
  })
})

describe('parseEvent', () => {
  it('works', () => {
    const expectedEvent: RawEventAbiDefinition = {
      anonymous: false,
      inputs: [
        { indexed: true, name: '_from', type: 'address' },
        { indexed: false, name: '_value', type: 'uint256' },
      ],
      name: 'Deposit',
      type: 'event',
    }
    const parsedEvent = parseEvent(expectedEvent)

    expect(parsedEvent).toEqual({
      name: 'Deposit',
      isAnonymous: false,
      inputs: [
        { name: '_from', isIndexed: true, type: { type: 'address', originalType: 'address' } },
        { name: '_value', isIndexed: false, type: { type: 'uinteger', bits: 256, originalType: 'uint256' } },
      ],
    })
  })
})

describe('parse', () => {
  describe('functions', () => {
    const abiPiece = {
      constant: false,
      inputs: [
        {
          name: 'foo',
          type: 'uint256',
        },
        {
          name: 'bar',
          type: 'bytes32',
        },
      ],
      name: 'doFooBar',
      outputs: [],
      payable: false,
      type: 'function',
    }

    const documentation = {
      details: 'A cool contract that does cool stuff',
      methods: {
        'doFooBar(uint256,bytes32)': {
          details: 'Does a bit of foo and some bar',
          params: {
            foo: 'A bit of foo',
            bar: 'Some bar',
          },
        },
      },
    }

    it('should get the documentation', () => {
      const res = parse([abiPiece], 'ACoolContract', documentation)

      expect(res.functions.doFooBar[0].documentation).toEqual(documentation.methods['doFooBar(uint256,bytes32)'])
      expect(res.documentation!.details).toEqual(documentation.details)
    })
  })

  describe('fallback functions', () => {
    it('should work on output-less fallback functions', () => {
      const fallbackAbiFunc: RawAbiDefinition = {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
      } as any

      expect(() => parse([fallbackAbiFunc], 'fallback')).not.toThrow()
    })
  })

  describe('empty names should be parsed as undefined', () => {
    it('should work on output-less fallback functions', () => {
      const event: RawAbiDefinition = {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        name: 'log_bytes32',
        type: 'event',
      } as any

      expect(parse([event], 'sc1')).toEqual({
        constructor: [],
        events: {
          log_bytes32: [
            {
              inputs: [
                {
                  isIndexed: false,
                  name: undefined,
                  type: {
                    size: 32,
                    type: 'bytes',
                    originalType: 'bytes32',
                  },
                },
              ],
              name: 'log_bytes32',
              isAnonymous: false,
            },
          ],
        },
        fallback: undefined,
        documentation: undefined,
        functions: {},
        name: 'Sc1',
        rawName: 'sc1',
      })
    })
  })
})

export function fixtureFactory<T>(defaults: T): (params?: Partial<T>) => T {
  return (params = {}) => merge({}, defaults, params)
}

describe('helpers', () => {
  const fnFactory = fixtureFactory<FunctionDeclaration>({
    name: 'constant',
    inputs: [],
    outputs: [{ type: { type: 'string', originalType: 'string' }, name: 'output' }],
    stateMutability: 'view',
  })

  const viewFn = fnFactory()
  const pureFn = fnFactory({ stateMutability: 'pure' })
  const payableFn = fnFactory(fnFactory({ stateMutability: 'payable' }))
  const nonPayableFn = fnFactory(fnFactory({ stateMutability: 'nonpayable' }))
  const viewWithInputs = fnFactory({
    stateMutability: 'pure',
    inputs: [{ type: { type: 'string', originalType: 'string' }, name: 'output' }],
  })

  describe('isConstant', () => {
    it('works', () => {
      expect(isConstant(viewFn)).toEqual(true)
      expect(isConstant(pureFn)).toEqual(true)
      expect(isConstant(payableFn)).toEqual(false)
      expect(isConstant(nonPayableFn)).toEqual(false)
      expect(isConstant(viewWithInputs)).toEqual(false)
    })
  })

  describe('isConstantFn', () => {
    it('works', () => {
      expect(isConstantFn(viewFn)).toEqual(false)
      expect(isConstantFn(pureFn)).toEqual(false)
      expect(isConstantFn(payableFn)).toEqual(false)
      expect(isConstantFn(nonPayableFn)).toEqual(false)
      expect(isConstantFn(viewWithInputs)).toEqual(true)
    })
  })
})
