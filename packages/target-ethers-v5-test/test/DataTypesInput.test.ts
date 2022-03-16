import type { FunctionFragment } from '@ethersproject/abi'
import { expect } from 'earljs'
import type { Awaited } from 'earljs/dist/mocks/types'
import type { BigNumberish } from 'ethers'
import { BigNumber, ethers } from 'ethers'
import type { AssertTrue, IsExact } from 'test-utils'
import { q18, typedAssert } from 'test-utils'

import type { DataTypesInput } from '../types/v0.6.4/DataTypesInput'
import { createNewBlockchain, deployContract } from './common'

type Struct1Struct = DataTypesInput.Struct1Struct
type Struct1StructOutput = DataTypesInput.Struct1StructOutput
type Struct2Struct = DataTypesInput.Struct2Struct
type Struct2StructOutput = DataTypesInput.Struct2StructOutput
type Struct3Struct = DataTypesInput.Struct3Struct
type Struct3StructOutput = DataTypesInput.Struct3StructOutput

describe('DataTypesInput', () => {
  let contract!: DataTypesInput
  let ganache: any
  beforeEach(async () => {
    const { ganache: _ganache, signer } = await createNewBlockchain()
    ganache = _ganache
    contract = await deployContract<DataTypesInput>(signer, 'DataTypesInput')
  })

  afterEach(() => ganache.close())

  it('works', async () => {
    typedAssert(await contract.input_uint8('42'), 42)
    typedAssert(await contract.input_uint8(42), 42)

    typedAssert(await contract.input_uint256(q18(1)), BigNumber.from(q18(1)))
    typedAssert(await contract.input_uint256(1), BigNumber.from(1))

    typedAssert(await contract.input_int8('42'), 42)
    typedAssert(await contract.input_int8(42), 42)

    typedAssert(await contract.input_int256(q18(1)), BigNumber.from(q18(1)))
    typedAssert(await contract.input_int256(1), BigNumber.from('1'))

    typedAssert(await contract.input_bool(true), true)

    typedAssert(
      await contract.input_address('0x70b144972C5Ef6CB941A5379240B74239c418CD4'),
      '0x70b144972C5Ef6CB941A5379240B74239c418CD4',
    )
    typedAssert(await contract.functions.input_address('0x70b144972C5Ef6CB941A5379240B74239c418CD4'), [
      '0x70b144972C5Ef6CB941A5379240B74239c418CD4',
    ])

    typedAssert(
      await contract.input_address('0x70b144972C5Ef6CB941A5379240B74239c418CD4'),
      '0x70b144972C5Ef6CB941A5379240B74239c418CD4',
    )

    typedAssert(await contract.input_bytes1('0xaa'), '0xaa')
    typedAssert(await contract.input_bytes1([0]), '0x00')

    typedAssert(
      await contract.input_bytes(ethers.utils.formatBytes32String('TypeChain')),
      '0x54797065436861696e0000000000000000000000000000000000000000000000',
    )

    typedAssert(await contract.input_string('TypeChain'), 'TypeChain')

    typedAssert(await contract.input_stat_array(['1', '2', '3']), [1, 2, 3])
    typedAssert(await contract.input_stat_array([1, 2, 3]), [1, 2, 3])

    // TODO: this reverts for some weird reason
    // typedAssert(await contract.input_tuple('1', '2'), { 0: new BigNumber('1'), 1: new BigNumber('2') })
    // typedAssert(await contract.input_tuple(1, 2), { 0: '1', 1: '2' })

    expect(
      await contract.input_struct({ uint256_0: BigNumber.from('1'), uint256_1: BigNumber.from('2') }),
    ).toLooseEqual(expect.a(Array))
    typedAssert(await contract.input_struct({ uint256_0: BigNumber.from('1'), uint256_1: BigNumber.from('2') }), {
      0: BigNumber.from('1'),
      1: BigNumber.from('2'),
      uint256_0: BigNumber.from('1'),
      uint256_1: BigNumber.from('2'),
    } as any)

    typedAssert(await contract.input_enum('1'), 1)
    typedAssert(await contract.input_enum(1), 1)
  })

  it('generates correct signature for tuples', () => {
    const fragment: FunctionFragment = contract.interface.functions['input_struct((uint256,uint256))']
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    expect(fragment !== undefined).toEqual(true)
  })

  // tests: https://github.com/ethereum-ts/TypeChain/issues/232
  // NOTE: typesAssert is too simple to tests type compatibility here so we can't use it
  it('generates correct types for tuples', () => {
    type ViewTupleType = Awaited<ReturnType<typeof contract.input_tuple>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewTupleType, [BigNumber, BigNumber]>>
  })

  it('generates correct input types for array', () => {
    type InputType = Parameters<typeof contract.input_uint_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<InputType, [input1: BigNumberish[], overrides?: ethers.CallOverrides | undefined]>>
  })

  it('generates correct output types for array', () => {
    type OutputType = Awaited<ReturnType<typeof contract.input_uint_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<OutputType, BigNumber[]>>
  })

  /**
   * For structs
   */

  it('generates correct types for input structs', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<Struct1Struct, { uint256_0: BigNumberish; uint256_1: BigNumberish }>>
  })

  it('generates correct types for output structs', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        Struct1StructOutput,
        [BigNumber, BigNumber] & {
          uint256_0: BigNumber
          uint256_1: BigNumber
        }
      >
    >
  })

  it('generates correct input types for structs with are only used as array in some function input/output', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<Struct3Struct, { input1: BigNumberish[] }>>
  })

  it('generates correct output types for structs with are only used as array in some function input/output', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        Struct3StructOutput,
        [BigNumber[]] & {
          input1: BigNumber[]
        }
      >
    >
  })

  it('generates correct types for input complex structs', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<Struct2Struct, { input1: BigNumberish; input2: { uint256_0: BigNumberish; uint256_1: BigNumberish } }>
    >
  })

  it('generates correct types for output complex structs', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        Struct2StructOutput,
        [
          BigNumber,
          [BigNumber, BigNumber] & {
            uint256_0: BigNumber
            uint256_1: BigNumber
          },
        ] & {
          input1: BigNumber
          input2: [BigNumber, BigNumber] & {
            uint256_0: BigNumber
            uint256_1: BigNumber
          }
        }
      >
    >
  })

  // function input_fixedarray_array_fixedarray(uint8[3][][4] memory input1) public pure returns (uint8[3][][4] memory)
  it('generates correct parameter types for function structs', () => {
    type ViewStructType = Parameters<typeof contract.input_fixedarray_array_fixedarray>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          input1: [
            [BigNumberish, BigNumberish, BigNumberish][],
            [BigNumberish, BigNumberish, BigNumberish][],
            [BigNumberish, BigNumberish, BigNumberish][],
            [BigNumberish, BigNumberish, BigNumberish][],
          ],
          overrides?: ethers.CallOverrides | undefined,
        ]
      >
    >
  })

  it('generates correct return types for function structs', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_fixedarray_array_fixedarray>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [[number, number, number][], [number, number, number][], [number, number, number][], [number, number, number][]]
      >
    >
  })

  /**
   * For functions with struct parameters
   */
  // function input_struct(Struct1 memory input1) public pure returns (Struct1 memory)
  it('generates correct parameter types for function structs', () => {
    type ViewStructType = Parameters<typeof contract.input_struct>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct1Struct, overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for function structs', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct1StructOutput>>
  })

  // function input_struct_array(Struct1[] memory input1) public pure returns (Struct1[] memory)
  it('generates correct parameter types for function struct array', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct1Struct[], overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for function struct array', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct1StructOutput[]>>
  })

  // function input_struct_array_array(Struct1[][] memory input1) public pure returns (Struct1[][] memory)
  it('generates correct parameter types for function struct array array', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_array_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct1Struct[][], overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for function struct array array', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_array_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct1StructOutput[][]>>
  })

  // function input_struct_fixedarray_array(Struct1[2][] memory input1) public pure returns (Struct1[2][] memory)
  it('generates correct parameter types for function struct fixedarray array', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_fixedarray_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: [Struct1Struct, Struct1Struct][], overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for function struct fixedarray array', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_fixedarray_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, [Struct1StructOutput, Struct1StructOutput][]>>
  })

  // function input_struct_array_fixedarray(Struct1[][2] memory input1) public pure returns (Struct1[][2] memory)
  it('generates correct parameter types for function struct array fixedarray', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_array_fixedarray>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [input1: [Struct1Struct[], Struct1Struct[]], overrides?: ethers.CallOverrides | undefined]
      >
    >
  })

  it('generates correct return types for function struct array fixedarray', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_array_fixedarray>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, [Struct1StructOutput[], Struct1StructOutput[]]>>
  })

  // function input_struct_fixedarray_fixedarray(Struct1[2][3] memory input1) public pure returns (Struct1[2][3] memory)
  it('generates correct parameter types for function struct fixedarray fixedarray', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_fixedarray_fixedarray>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          input1: [[Struct1Struct, Struct1Struct], [Struct1Struct, Struct1Struct], [Struct1Struct, Struct1Struct]],
          overrides?: ethers.CallOverrides | undefined,
        ]
      >
    >
  })

  it('generates correct return types for function struct fixedarray fixedarray', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_fixedarray_fixedarray>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          [Struct1StructOutput, Struct1StructOutput],
          [Struct1StructOutput, Struct1StructOutput],
          [Struct1StructOutput, Struct1StructOutput],
        ]
      >
    >
  })

  // function input_struct_array_array_array(Struct1[][][] memory input1) public pure returns (Struct1[][][] memory) {
  it('generates correct parameter types for function struct array array array', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_array_array_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct1Struct[][][], overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for function struct array array array', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_array_array_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct1StructOutput[][][]>>
  })

  // function input_struct_fixedarray_array_fixedarray(Struct1[2][][3] memory input1) public pure returns (Struct1[2][][3] memory) {
  it('generates correct parameter types for function struct fixedarray array fixedarray', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_fixedarray_array_fixedarray>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          input1: [
            [Struct1Struct, Struct1Struct][],
            [Struct1Struct, Struct1Struct][],
            [Struct1Struct, Struct1Struct][],
          ],
          overrides?: ethers.CallOverrides | undefined,
        ]
      >
    >
  })

  it('generates correct return types for function struct fixedarray array fixedarray', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_fixedarray_array_fixedarray>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          [Struct1StructOutput, Struct1StructOutput][],
          [Struct1StructOutput, Struct1StructOutput][],
          [Struct1StructOutput, Struct1StructOutput][],
        ]
      >
    >
  })

  // function input_struct_fixedarray_array_fixedarray_array_fixedarray(Struct1[2][][3][][4] memory input1) public pure returns (Struct1[2][][3][][4] memory)
  it('generates correct parameter types for function struct fixedarray array fixedarray array fixedarray', () => {
    type ViewStructType = Parameters<typeof contract.input_struct_fixedarray_array_fixedarray_array_fixedarray>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          input1: [
            [[Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][]][],
            [[Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][]][],
            [[Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][]][],
            [[Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][], [Struct1Struct, Struct1Struct][]][],
          ],
          overrides?: ethers.CallOverrides | undefined,
        ]
      >
    >
  })

  it('generates correct return types for function struct fixedarray array fixedarray array fixedarray', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct_fixedarray_array_fixedarray_array_fixedarray>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewStructType,
        [
          [
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
          ][],
          [
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
          ][],
          [
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
          ][],
          [
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
            [Struct1StructOutput, Struct1StructOutput][],
          ][],
        ]
      >
    >
  })

  // function input_struct3_array(Struct3[] memory input1) public pure returns (Struct3[] memory) {
  it('generates correct parameter types for function structs only used as array in some function input/output', () => {
    type ViewStructType = Parameters<typeof contract.input_struct3_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct3Struct[], overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for function structs only used as array in some function input/output', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct3_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct3StructOutput[]>>
  })

  // function input_struct2(Struct2 memory input1) public pure returns (Struct2 memory)
  it('generates correct parameter types for complex function structs', () => {
    type ViewStructType = Parameters<typeof contract.input_struct2>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct2Struct, overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for complex function structs', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct2>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct2StructOutput>>
  })

  // function input_struct2_array(Struct2[] memory input1) public pure returns (Struct2[] memory)
  it('generates correct parameter types for complex struct array', () => {
    type ViewStructType = Parameters<typeof contract.input_struct2_array>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<ViewStructType, [input1: Struct2Struct[], overrides?: ethers.CallOverrides | undefined]>
    >
  })

  it('generates correct return types for complex struct array', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct2_array>>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<IsExact<ViewStructType, Struct2StructOutput[]>>
  })

  // function input_struct2_tuple(Struct2[3] memory input) public pure returns (Struct2[3] memory)
  it('generates correct argument types for constant size struct array', () => {
    type ViewStructType = Parameters<typeof contract.input_struct2_tuple>[0]
    type _ = AssertTrue<IsExact<ViewStructType, [Struct2Struct, Struct2Struct, Struct2Struct]>>
  })

  it('generates correct return types for constant size struct array', () => {
    type ViewStructType = Awaited<ReturnType<typeof contract.input_struct2_tuple>>
    type _ = AssertTrue<IsExact<ViewStructType, [Struct2StructOutput, Struct2StructOutput, Struct2StructOutput]>>
  })

  it('output structs are compatible with input structs', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _result: Struct1Struct = await contract.input_struct({
      uint256_0: 1,
      uint256_1: 2,
    })
  })

  it('structs with same name in different contract/library: input test', async () => {
    type ViewFunctionInputType = Parameters<typeof contract.input_multiple_structs_with_same_name>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type _t1 = AssertTrue<
      IsExact<
        ViewFunctionInputType,
        [info1: { a: BigNumberish; b: BigNumberish }, overrides?: ethers.CallOverrides | undefined]
      >
    >

    type ViewFunctionOutputType = Awaited<ReturnType<typeof contract.input_multiple_structs_with_same_name>>
    type _t2 = AssertTrue<
      IsExact<
        ViewFunctionOutputType,
        [string, string] & {
          a: string
          b: string
        }
      >
    >
  })

  // we skip this test as ts only about types
  it.skip('prevents from using not existing methods', () => {
    // @ts-expect-error
    contract.not_existing(1)
    // @ts-expect-error
    contract.functions.not_existing(1)
  })
}).timeout(15_000)
