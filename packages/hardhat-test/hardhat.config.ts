// We load the plugin here.
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'

import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  solidity: '0.8.7',
  defaultNetwork: 'hardhat',
}

export default config
