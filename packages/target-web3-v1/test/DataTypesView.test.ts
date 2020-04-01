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
  })
})
