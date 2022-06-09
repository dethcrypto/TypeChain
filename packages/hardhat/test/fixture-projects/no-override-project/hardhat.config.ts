// We load the plugin here.
import '../../../src/index'

import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  solidity: '0.7.3',
  defaultNetwork: 'hardhat',
  typechain: {
    dontOverrideCompile: true,
  },
}

export default config
