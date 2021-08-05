import './type-extensions'

import fsExtra from 'fs-extra'
import { TASK_CLEAN, TASK_COMPILE, TASK_COMPILE_SOLIDITY_COMPILE_JOBS } from 'hardhat/builtin-tasks/task-names'
import { extendConfig, subtask, task, types } from 'hardhat/config'
import { getFullyQualifiedName } from 'hardhat/utils/contract-names'
import _, { uniq } from 'lodash'
import { glob, runTypeChain } from 'typechain'

import { getDefaultTypechainConfig } from './config'
import { TASK_TYPECHAIN, TASK_TYPECHAIN_GENERATE_TYPES } from './constants'

const taskArgsStore: { noTypechain: boolean; fullRebuild: boolean } = { noTypechain: false, fullRebuild: false }

extendConfig((config) => {
  config.typechain = getDefaultTypechainConfig(config)
})

task(TASK_COMPILE, 'Compiles the entire project, building all artifacts')
  .addFlag('noTypechain', 'Skip Typechain compilation')
  .setAction(async ({ noTypechain }: { global: boolean; noTypechain: boolean }, _, runSuper) => {
    // just save task arguments for later b/c there is no easier way to access them in subtask
    taskArgsStore.noTypechain = noTypechain!!

    await runSuper()
  })

subtask(TASK_COMPILE_SOLIDITY_COMPILE_JOBS, 'Compiles the entire project, building all artifacts').setAction(
  async (taskArgs, { run }, runSuper) => {
    const compileSolOutput = await runSuper(taskArgs)
    await run(TASK_TYPECHAIN_GENERATE_TYPES, { compileSolOutput })
    return compileSolOutput
  },
)

subtask(TASK_TYPECHAIN_GENERATE_TYPES)
  .addParam('compileSolOutput', 'Solidity compilation output', {}, types.any)
  .setAction(async ({ compileSolOutput }, { config, artifacts }) => {
    const artifactFQNs: string[] = getFQNamesFromCompilationOutput(compileSolOutput)
    const artifactPaths = uniq(
      artifactFQNs.map((fqn) => (artifacts as any)._getArtifactPathFromFullyQualifiedName(fqn)),
    )

    if (taskArgsStore.noTypechain) {
      return compileSolOutput
    }

    // RUN TYPECHAIN TASK
    const typechainCfg = config.typechain
    if (artifactPaths.length === 0 && !taskArgsStore.fullRebuild && !typechainCfg.externalArtifacts) {
      console.log('No need to generate any newer typings.')
      return compileSolOutput
    }

    // incremental generation is only supported in 'ethers-v5'
    // @todo: probably targets should specify somehow if then support incremental generation this won't work with custom targets
    const needsFullRebuild = taskArgsStore.fullRebuild || typechainCfg.target !== 'ethers-v5'
    console.log(
      `Generating typings for: ${artifactPaths.length} artifacts in dir: ${typechainCfg.outDir} for target: ${typechainCfg.target}`,
    )
    const cwd = config.paths.root

    const allFiles = glob(cwd, [`${config.paths.artifacts}/!(build-info)/**/+([a-zA-Z0-9_]).json`])
    if (typechainCfg.externalArtifacts) {
      allFiles.push(...glob(cwd, typechainCfg.externalArtifacts, false))
    }
    const result = await runTypeChain({
      cwd,
      filesToProcess: needsFullRebuild ? allFiles : glob(cwd, artifactPaths), // only process changed files if not doing full rebuild
      allFiles,
      outDir: typechainCfg.outDir,
      target: typechainCfg.target,
      flags: {
        alwaysGenerateOverloads: config.typechain.alwaysGenerateOverloads,
        environment: 'hardhat',
      },
    })
    console.log(`Successfully generated ${result.filesGenerated} typings!`)
    // if this is not full rebuilding, always re-generate types for external artifacts
    if (!needsFullRebuild && typechainCfg.externalArtifacts) {
      const result = await runTypeChain({
        cwd,
        filesToProcess: glob(cwd, typechainCfg.externalArtifacts!, false), // only process files with external artifacts
        allFiles,
        outDir: typechainCfg.outDir,
        target: typechainCfg.target,
        flags: {
          alwaysGenerateOverloads: config.typechain.alwaysGenerateOverloads,
          environment: 'hardhat',
        },
      })
      console.log(`Successfully generated ${result.filesGenerated} typings for external artifacts!`)
    }
  })

task(TASK_TYPECHAIN, 'Generate Typechain typings for compiled contracts').setAction(async (_, { run }) => {
  taskArgsStore.fullRebuild = true
  await run(TASK_COMPILE, { quiet: true })
})

task(
  TASK_CLEAN,
  'Clears the cache and deletes all artifacts',
  async ({ global }: { global: boolean }, { config }, runSuper) => {
    if (global) {
      return
    }

    if (await fsExtra.pathExists(config.typechain.outDir)) {
      await fsExtra.remove(config.typechain.outDir)
    }

    await runSuper()
  },
)

function getFQNamesFromCompilationOutput(compileSolOutput: any): string[] {
  const allFQNNamesNested = compileSolOutput.artifactsEmittedPerJob.map((a: any) => {
    return a.artifactsEmittedPerFile.map((artifactPerFile: any) => {
      return artifactPerFile.artifactsEmitted.map((artifactName: any) => {
        return getFullyQualifiedName(artifactPerFile.file.sourceName, artifactName)
      })
    })
  })

  return _(allFQNNamesNested).flatten().flatten().value()
}
