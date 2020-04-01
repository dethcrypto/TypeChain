import { createNewBlockchain, deployContract, typedAssert, GAS_LIMIT_STANDARD, asyncWithDone } from './common'
import { Events } from '../types/Events'

// Docs: https://web3js.readthedocs.io/en/v1.2.6/web3-eth-contract.html#events
describe('Events', () => {
  let contract: Events
  let accounts: string[]
  beforeEach(async () => {
    const { web3, accounts: _accounts } = await createNewBlockchain()
    accounts = _accounts
    contract = await deployContract<Events>(web3, accounts, 'Events')
  })

  it(
    'works using once',
    asyncWithDone(async (done) => {
      contract.once('Event1', (_, event) => {
        typedAssert(event.returnValues.value1, '1')
        typedAssert(event.returnValues.value2, '2')
        typedAssert(event.returnValues[0], '1')
        typedAssert(event.returnValues[1], '2')

        done()
      })

      await contract.methods.emit_event1().send({ from: accounts[0], gas: GAS_LIMIT_STANDARD })
    }),
  )

  it(
    'works using events property',
    asyncWithDone(async (done) => {
      contract.events.Event1((_, event) => {
        typedAssert(event.returnValues.value1, '1')
        typedAssert(event.returnValues.value2, '2')
        typedAssert(event.returnValues[0], '1')
        typedAssert(event.returnValues[1], '2')

        done()
      })

      await contract.methods.emit_event1().send({ from: accounts[0], gas: GAS_LIMIT_STANDARD })
    }),
  )

  it.skip('works using events property using EventEmitter')
})
