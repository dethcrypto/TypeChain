import { HardhatConfig } from 'hardhat/types'

import { TypechainConfig } from './types'

export function getDefaultTypechainConfig(config: HardhatConfig): TypechainConfig {
  const defaultConfig: TypechainConfig = {
    outDir: 'typechain-types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    discriminateTypes: false,
    tsNocheck: false,
  }

  return {
    ...defaultConfig,
    ...config.typechain,
  }
}
