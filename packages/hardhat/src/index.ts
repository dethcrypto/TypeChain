import fsExtra from 'fs-extra'
import { TASK_CLEAN, TASK_COMPILE, TASK_COMPILE_SOLIDITY_COMPILE_JOBS } from 'hardhat/builtin-tasks/task-names'
import { extendConfig, task, subtask } from 'hardhat/config'
import { HardhatPluginError } from 'hardhat/plugins'

import { getDefaultTypechainConfig } from './config'
import './type-extensions'

const taskArgsStore: { noTypechain: boolean } = { noTypechain: false }

extendConfig((config) => {
  config.typechain = getDefaultTypechainConfig(config)

  const typechainTargets = ['ethers-v5', 'web3-v1', 'truffle-v5']
  if (!typechainTargets.includes(config.typechain.target)) {
    throw new HardhatPluginError(
      'Typechain',
      'Invalid Typechain target, please provide via hardhat.config.js (typechain.target)',
    )
  }
})

task(TASK_COMPILE, 'Compiles the entire project, building all artifacts')
  .addFlag('noTypechain', 'Skip Typechain compilation')
  .setAction(async ({ noTypechain }: { global: boolean; noTypechain: boolean }, { config }, runSuper) => {
    // just save task arguments for later b/c there is no easier way to access them in subtask
    taskArgsStore.noTypechain = noTypechain!!

    await runSuper()
  })

subtask(TASK_COMPILE_SOLIDITY_COMPILE_JOBS, 'Compiles the entire project, building all artifacts').setAction(
  async (taskArgs, { config }, runSuper) => {
    const compileSolOutput = await runSuper(taskArgs)
    const filesToCompile: string[] = compileSolOutput.artifactsEmittedPerJob[0].compilationJob
      .getResolvedFiles()
      .map((rf: any) => rf.absolutePath)

    if (taskArgsStore.noTypechain) {
      return compileSolOutput
    }

    debugger

    // RUN TYPECHAIN TASK
    const typechainCfg = config.typechain
    console.log(
      `Generating TypeChain typings for: ${filesToCompile.length} artifacts in dir: ${typechainCfg.outDir} for target: ${typechainCfg.target}`,
    )
    const cwd = process.cwd()
    const { TypeChain } = await import('typechain/dist/TypeChain')
    const { tsGenerator } = await import('ts-generator')
    await tsGenerator(
      { cwd },
      new TypeChain({
        cwd,
        rawConfig: {
          files: `${config.paths.artifacts}/!(build-info)/**/+([a-zA-Z0-9_]).json`,
          outDir: typechainCfg.outDir,
          target: typechainCfg.target,
        },
      }),
    )
    console.log(`Successfully generated Typechain artifacts!`)

    return compileSolOutput
  },
)

task('typechain', 'Generate Typechain typings for compiled contracts').setAction(async (_, { run }) => {
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
