import BigNumber from 'bn.js'
import { asyncWithDoneCase, typedAssert } from 'test-utils'

import type { Events } from '../types/Events'
import { createNewBlockchain, deployContract, GAS_LIMIT_STANDARD } from './common'

// Docs: https://web3js.readthedocs.io/en/v1.2.6/web3-eth-contract.html#events
describe('Events', () => {
  let contract: Events
  let accounts: string[]
  beforeEach(async () => {
    const { web3, accounts: _accounts } = await createNewBlockchain()
    accounts = _accounts
    contract = await deployContract<Events>(web3, accounts, 'Events')
  })

  describe('Event1', () => {
    it(
      'works using once',
      asyncWithDoneCase(async (done) => {
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
      asyncWithDoneCase(async (done) => {
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

  describe('Event2', () => {
    it(
      'works using once',
      asyncWithDoneCase(async (done) => {
        contract.once('Event2', (_, event) => {
          typedAssert(event.returnValues[0], '1')

          done()
        })

        await contract.methods.emit_event2().send({ from: accounts[0], gas: GAS_LIMIT_STANDARD })
      }),
    )
  })

  describe('Event3 (overloads)', () => {
    it(
      'works using events property',
      asyncWithDoneCase(async (done) => {
        contract.events['Event3(bool,uint256)']((_, event) => {
          typedAssert(event.returnValues.value1, true)
          typedAssert(event.returnValues.value2, '2')
          typedAssert(event.returnValues[0], true)
          typedAssert(event.returnValues[1], '2')

          done()
        })

        await contract.methods.emit_event3().send({ from: accounts[0], gas: GAS_LIMIT_STANDARD })
      }),
    )

    it(
      'works using events property for overloaded type',
      asyncWithDoneCase(async (done) => {
        contract.events['Event3(uint256)']((_, event) => {
          typedAssert(event.returnValues.value1, '1')
          typedAssert(event.returnValues[0], '1')

          done()
        })

        await contract.methods.emit_event3_overloaded().send({ from: accounts[0], gas: GAS_LIMIT_STANDARD })
      }),
    )
  })

  describe('EIP1559 overrides', () => {
    it('works', async () => {
      await contract.methods.emit_event1().send({
        from: accounts[0],
        gas: GAS_LIMIT_STANDARD,
        maxFeePerGas: new BigNumber('1'),
        maxPriorityFeePerGas: new BigNumber('1'),
      })
      // doesn't throw error
    })
  })
})
