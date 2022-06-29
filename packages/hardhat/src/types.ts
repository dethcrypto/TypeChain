export interface TypechainConfig {
  outDir: string
  target: string
  artifacts: string
  alwaysGenerateOverloads: boolean
  discriminateTypes: boolean
  tsNocheck: boolean
  externalArtifacts?: string[]
  dontOverrideCompile: boolean
}

export interface TypechainUserConfig extends Partial<TypechainConfig> {}
