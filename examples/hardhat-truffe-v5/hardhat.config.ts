import '@nomiclabs/hardhat-truffle5'
import '@typechain/hardhat'
import { HardhatUserConfig } from 'hardhat/types'

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: {
    compilers: [{ version: '0.6.8', settings: {} }],
  },
  typechain: {
    target: "truffle-v5",
  },
}

export default config
