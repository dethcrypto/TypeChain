import { HardhatConfig } from 'hardhat/types'

import { TypechainConfig } from './types'

export function getDefaultTypechainConfig(config: HardhatConfig): TypechainConfig {
  const defaultConfig: TypechainConfig = {
    outDir: 'typechain-types',
    target: 'ethers-v6',
    alwaysGenerateOverloads: false,
    discriminateTypes: false,
    tsNocheck: false,
    dontOverrideCompile: false,
    node16Modules: false,
  }

  return {
    ...defaultConfig,
    ...config.typechain,
  }
}
