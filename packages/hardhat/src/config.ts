import { HardhatConfig } from 'hardhat/types'

import { TypechainConfig } from './types'

export function getDefaultTypechainConfig(config: HardhatConfig): TypechainConfig {
  const defaultConfig: TypechainConfig = {
    outDir: 'typechain-types',
    target: 'ethers-v5',
    artifacts: `${config.paths.artifacts}/!(build-info)/**/+([a-zA-Z0-9_]).json`,
    alwaysGenerateOverloads: false,
    discriminateTypes: false,
    tsNocheck: false,
    dontOverrideCompile: false,
  }

  return {
    ...defaultConfig,
    ...config.typechain,
  }
}
