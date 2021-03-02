export interface TypechainUserConfig {
  outDir?: string
  target?: 'ethers-v5' | 'web3-v1' | 'truffle-v5'
}

export interface TypechainConfig {
  outDir: string
  target: 'ethers-v5' | 'web3-v1' | 'truffle-v5'
}
