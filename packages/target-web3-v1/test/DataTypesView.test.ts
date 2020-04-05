import { createNewBlockchain, deployContract, typedAssert, q18 } from './common'
import { DataTypesView } from '../types/DataTypesView'

describe('DataTypesView', () => {
  let contract!: DataTypesView
  beforeEach(async () => {
    const { web3, accounts } = await createNewBlockchain()
    contract = await deployContract<DataTypesView>(web3, accounts, 'DataTypesView')
  })

  it('works', async () => {
    typedAssert(await contract.methods.view_uint8().call(), '42')
    typedAssert(await contract.methods.view_uint256().call(), q18(1))

    typedAssert(await contract.methods.view_int8().call(), '42')
    typedAssert(await contract.methods.view_int256().call(), q18(1))

    typedAssert(await contract.methods.view_bool().call(), true)

    typedAssert(await contract.methods.view_address().call(), '0x70b144972C5Ef6CB941A5379240B74239c418CD4')

    typedAssert(await contract.methods.view_bytes1().call(), '0xaa')
    typedAssert(await contract.methods.view_bytes().call(), '0x54797065436861696e')

    typedAssert(await contract.methods.view_string().call(), 'TypeChain')

    typedAssert(await contract.methods.view_stat_array().call(), ['1', '2', '3'])

    typedAssert(await contract.methods.view_tuple().call(), { 0: '1', 1: '2' })
    typedAssert(await contract.methods.view_named().call(), { 0: '1', 1: '2', uint256_1: '1', uint256_2: '2' })

    typedAssert(await contract.methods.view_struct().call(), { uint256_0: '1', uint256_1: '2' })

    typedAssert(await contract.methods.view_enum().call(), '1')
  })
})
