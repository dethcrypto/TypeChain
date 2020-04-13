import { typedAssert, q18 } from 'test-utils'
import { DataTypesPureInstance } from '../types/truffle-contracts/DataTypesPure'
import BigNumber from 'bn.js'

const DataTypesPure = artifacts.require('DataTypesPure')

contract('DataTypesPure', ([deployer]) => {
  let c: DataTypesPureInstance

  beforeEach(async () => {
    c = await DataTypesPure.new({ from: deployer })
  })

  it('works', async () => {
    typedAssert(await c.pure_uint8(), new BigNumber('42'))
    typedAssert(await c.pure_uint256(), new BigNumber(q18(1)))

    typedAssert(await c.pure_int8(), new BigNumber('42'))
    typedAssert(await c.pure_int256(), new BigNumber(q18(1)))

    typedAssert(await c.pure_bool(), true)

    typedAssert(await c.pure_address(), '0x70b144972C5Ef6CB941A5379240B74239c418CD4')

    typedAssert(await c.pure_bytes1(), '0xaa')

    typedAssert(await c.pure_bytes(), '0x54797065436861696e')

    typedAssert(await c.pure_string(), 'TypeChain')

    typedAssert(await c.pure_stat_array(), [new BigNumber('1'), new BigNumber('2'), new BigNumber('3')])

    typedAssert(await c.pure_tuple(), [new BigNumber('1'), new BigNumber('2')])

    // structs doesnt work: could be because of solidty 0.4.x but we are stuck at it
    // typedAssert(await c.pure_struct(), {
    //   uint256_0: new BigNumber('1'),
    //   uint256_1: new BigNumber('2'),
    // })

    typedAssert(await c.pure_enum(), new BigNumber('1'))
  })
})
