import Web3 from 'web3'

import { Dai } from '../types/web3-v1-contracts/Dai'

const abi = require('../abi/dai.json')

const RPC_HOST = 'wss://mainnet.infura.io/ws/v3/6d6c70e65c77429482df5b64a4d0c943'
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

async function main() {
  const web3 = new Web3(RPC_HOST)
  const fromWei = web3.utils.fromWei

  const dai = new web3.eth.Contract(abi, DAI_ADDRESS) as any as Dai
  const balance = await dai.methods.balanceOf('0x70b144972C5Ef6CB941A5379240B74239c418CD4').call()

  console.log(`Our DAI balance is: ${fromWei(balance)}`)

  console.log('Listening for transfer events...')
  dai.events.Transfer((err, e) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`${fromWei(e.returnValues.wad)} DAI transferred ${e.returnValues.src} -> ${e.returnValues.dst}`)
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
