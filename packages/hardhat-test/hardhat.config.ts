// We load the plugin here.
import '@typechain/hardhat'

import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  solidity: '0.6.8',
  defaultNetwork: 'hardhat',
}

export default config
