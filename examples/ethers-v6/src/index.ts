// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers'

import { Dai__factory } from '../types/ethers-contracts/factories/Dai__factory'

const RPC_HOST = 'https://mainnet.infura.io/v3/6d6c70e65c77429482df5b64a4d0c943'
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const BLOCK_NUMBER = 13730326

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_HOST)
  const dai = Dai__factory.connect(DAI_ADDRESS, provider)
  const balance = await dai.balanceOf('0x70b144972C5Ef6CB941A5379240B74239c418CD4')

  console.log(`Our DAI balance is: ${ethers.formatEther(balance)}`)

  console.log(`Listing Transfer events for block ${BLOCK_NUMBER}`)
  const eventsFilter = dai.filters.Transfer()
  const events = await dai.queryFilter(eventsFilter, BLOCK_NUMBER, BLOCK_NUMBER)

  for (const event of events) {
    console.log(`${event.args.src} -> ${event.args.dst} | ${ethers.formatEther(event.args.wad)} DAI`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
