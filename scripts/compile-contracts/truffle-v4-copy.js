/**
 * Copy contracts from ./contract to:
 *  - packages/target-truffle-v4-test
 *
 * and change compiler version
 */
const fs = require('fs')
const { join } = require('path')

const contractDir = join(__dirname, '../../contracts')
const outDir = join(__dirname, '../../packages/target-truffle-v4-test/contracts')

const files = fs
  .readdirSync(contractDir)
  .filter((f) => f.endsWith('.sol'))
  // do not copy Library.sol and LibraryConsumer.sol as enums in libraries are not properly supported in Truffle v4 ABIs
  .filter((f) => !f.endsWith('Library.sol') && !f.endsWith('LibraryConsumer.sol'))

if (!fs.existsSync(outDir)) {
  console.log(`Creating ${outDir}`)
  fs.mkdirSync(outDir)
}

for (const file of files) {
  console.log('Processing: ', file)

  const contents = fs.readFileSync(join(contractDir, file), 'utf8')
  const newContents = contents.replace('0.6.4', '0.4.24')
  fs.writeFileSync(join(outDir, file), newContents)
}
