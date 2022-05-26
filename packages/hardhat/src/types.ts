export interface TypechainConfig {
  outDir: string
  target: string
  alwaysGenerateOverloads: boolean
  discriminateTypes: boolean
  tsNocheck: boolean
  externalArtifacts?: string[]
}

export interface TypechainUserConfig extends Partial<TypechainConfig> {}
