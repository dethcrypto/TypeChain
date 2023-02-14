export interface TypechainConfig {
  outDir: string
  target: string
  artifacts?: string[] | undefined
  alwaysGenerateOverloads: boolean
  discriminateTypes: boolean
  tsNocheck: boolean
  externalArtifacts?: string[]
  dontOverrideCompile: boolean
  node16Modules: boolean // defaults to false
}

export interface TypechainUserConfig extends Partial<TypechainConfig> {}
