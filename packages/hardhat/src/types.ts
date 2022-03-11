export interface TypechainUserConfig {
  outDir?: string
  target?: string
  alwaysGenerateOverloads?: boolean
  tsNocheck?: boolean
  externalArtifacts?: string[]
}

export interface TypechainConfig {
  outDir: string
  target: string
  alwaysGenerateOverloads: boolean
  discriminateTypes: boolean
  tsNocheck: boolean
  externalArtifacts?: string[]
}
