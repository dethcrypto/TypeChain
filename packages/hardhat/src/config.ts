import type { HardhatUserConfig } from 'hardhat/types'

import type { TypechainConfig } from './types'

export function getDefaultTypechainConfig(config: HardhatUserConfig): TypechainConfig {
  const defaultConfig: TypechainConfig = {
    outDir: 'typechain-types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
    tsNocheck: false,
  }

  return {
    ...defaultConfig,
    ...config.typechain,
  }
}
