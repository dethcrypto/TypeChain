import { typedAssert, q18 } from 'test-utils'
import { DataTypesViewInstance } from '../types/truffle-contracts'
import BigNumber from 'bignumber.js'

const DataTypesView = artifacts.require('DataTypesView')

contract('DataTypesView', ([deployer]) => {
  let c: DataTypesViewInstance

  beforeEach(async () => {
    c = await DataTypesView.new({ from: deployer })
  })

  it('works', async () => {
    typedAssert(await c.view_uint8(), new BigNumber('42'))
    typedAssert(await c.view_uint256(), new BigNumber(q18(1)))

    typedAssert(await c.view_int8(), new BigNumber('42'))
    typedAssert(await c.view_int256(), new BigNumber(q18(1)))

    typedAssert(await c.view_bool(), true)

    typedAssert(await c.view_address(), '0x70b144972c5ef6cb941a5379240b74239c418cd4')

    typedAssert(await c.view_bytes1(), '0xaa')

    typedAssert(await c.view_bytes(), '0x54797065436861696e')

    typedAssert(await c.view_string(), 'TypeChain')

    typedAssert(await c.view_stat_array(), [new BigNumber('1'), new BigNumber('2'), new BigNumber('3')])

    typedAssert(await c.view_tuple(), [new BigNumber('1'), new BigNumber('2')])

    // structs doesnt work: could be because of solidty 0.4.x but we are stuck at it
    // typedAssert(await c.view_struct(), {
    //   uint256_0: new BigNumber('1'),
    //   uint256_1: new BigNumber('2'),
    // })

    typedAssert(await c.view_enum(), new BigNumber('1'))
  })
})
