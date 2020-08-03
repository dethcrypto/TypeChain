import * as ethers from 'ethers'
import { Dai } from '../types/ethers-contracts/Dai'

const abi = require('../abi/dai.json')

const RPC_HOST = 'https://mainnet.infura.io/v3/6d6c70e65c77429482df5b64a4d0c943'
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F'

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_HOST)
  const formatEther = ethers.utils.formatEther

  const dai = (new ethers.Contract(DAI_ADDRESS, abi, provider) as any) as Dai
  const balance = await dai.functions.balanceOf('0x70b144972C5Ef6CB941A5379240B74239c418CD4')

  console.log(`Our DAI balance is: ${formatEther(balance[0])}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
