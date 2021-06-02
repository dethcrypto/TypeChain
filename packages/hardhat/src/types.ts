export interface TypechainUserConfig {
  outDir?: string
  target?: string
  alwaysGenerateOverloads?: boolean
  externalArtifacts?: string[]
}

export interface TypechainConfig {
  outDir: string
  target: string
  alwaysGenerateOverloads: boolean
  externalArtifacts?: string[]
}
