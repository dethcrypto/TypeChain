import { readFileSync } from 'fs'
import { join } from 'path'

const abiDirPath = join(__dirname, '../../../contracts/compiled')

export function loadContract(contractName: string): { code: string; abi: any } {
  const abi = JSON.parse(readFileSync(join(abiDirPath, contractName + '.abi'), 'utf-8'))
  const bin = readFileSync(join(abiDirPath, contractName + '.bin'), 'utf-8')
  const code = '0x' + bin

  return { code, abi }
}
