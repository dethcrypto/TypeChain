import { typedAssert, q18 } from 'test-utils'
import { DataTypesInputInstance } from '../types/truffle-contracts'
import BigNumber from 'bignumber.js'

const DataTypesInput = artifacts.require('DataTypesInput')

contract('DataTypesInput', ([deployer]) => {
  let c: DataTypesInputInstance

  beforeEach(async () => {
    c = await DataTypesInput.new({ from: deployer })
  })

  it('works', async () => {
    typedAssert(await c.input_uint8('42'), new BigNumber('42'))
    typedAssert(await c.input_uint8(42), new BigNumber('42'))
    typedAssert(await c.input_uint8(new BigNumber(42)), new BigNumber('42'))

    typedAssert(await c.input_uint256(q18(1)), new BigNumber(q18(1)))
    typedAssert(await c.input_uint256(1), new BigNumber('1'))
    typedAssert(await c.input_uint256(new BigNumber(42)), new BigNumber('42'))

    typedAssert(await c.input_int8('42'), new BigNumber('42'))
    typedAssert(await c.input_int8(42), new BigNumber('42'))
    typedAssert(await c.input_int8(new BigNumber(42)), new BigNumber('42'))

    typedAssert(await c.input_int256(q18(1)), new BigNumber(q18(1)))
    typedAssert(await c.input_int256(1), new BigNumber('1'))
    typedAssert(await c.input_int256(new BigNumber(42)), new BigNumber('42'))

    typedAssert(await c.input_bool(true), true)

    typedAssert(
      await c.input_address('0x70b144972C5Ef6CB941A5379240B74239c418CD4'),
      '0x70b144972c5ef6cb941a5379240b74239c418cd4',
    )
    typedAssert(
      await c.input_address(new BigNumber('0x70b144972C5Ef6CB941A5379240B74239c418CD4')),
      '0x70b144972c5ef6cb941a5379240b74239c418cd4',
    )

    typedAssert(await c.input_bytes1('0xaa'), '0xaa')
    typedAssert(await c.input_bytes1(new BigNumber('0xaa')), '0xaa')

    typedAssert(await c.input_bytes('TypeChain'), '0x54797065436861696e')

    typedAssert(await c.input_string('TypeChain'), 'TypeChain')

    typedAssert(await c.input_stat_array(['1', '2', '3']), [new BigNumber('1'), new BigNumber('2'), new BigNumber('3')])
    typedAssert(await c.input_stat_array([1, 2, 3]), [new BigNumber('1'), new BigNumber('2'), new BigNumber('3')])
    typedAssert(await c.input_stat_array([new BigNumber('1'), new BigNumber('2'), new BigNumber('3')]), [
      new BigNumber('1'),
      new BigNumber('2'),
      new BigNumber('3'),
    ])

    typedAssert(await c.input_tuple('1', '2'), [new BigNumber('1'), new BigNumber('2')])
    typedAssert(await c.input_tuple(1, 2), [new BigNumber('1'), new BigNumber('2')])
    typedAssert(await c.input_tuple(new BigNumber(1), new BigNumber(2)), [new BigNumber('1'), new BigNumber('2')])

    // structs doesnt work: could be because of solidty 0.4.x but we are stuck at it
    // typedAssert(await c.input_struct({ uint256_0: '1', uint256_1: '2' }), {
    //   uint256_0: new BigNumber('1'),
    //   uint256_1: new BigNumber('2'),
    // })
    // typedAssert(await c.input_struct([1, 2]), ['1', '2'])

    typedAssert(await c.input_enum('1'), new BigNumber('1'))
    typedAssert(await c.input_enum(1), new BigNumber('1'))
    typedAssert(await c.input_enum(new BigNumber('1')), new BigNumber('1'))
  })
})
