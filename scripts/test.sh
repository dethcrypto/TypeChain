#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

mode=$1

echo "Cleanup"

cd ./test/integration/contracts/
ABI_DIR="../abis"
rm -rf $ABI_DIR

echo "Generating ABIs for sample contracts"
../../../node_modules/krzkaczor-solc/solcjs --abi ./* --bin -o $ABI_DIR
echo "Compiling truffle project"
(cd ../targets/truffle && ../../../../node_modules/.bin/truffle compile)

echo "Building"
yarn build

echo "Running tests"
if [ "$mode" = "COVERAGE" ]; then
  yarn test:mocha:coverage
else
  yarn test:mocha
fi

echo "Type checking generated wrappers"
yarn tsc --noUnusedParameters
yarn tsc:truffle
(cd ../targets/truffle && ../../../../node_modules/.bin/truffle test)
(cd ../targets/web3-v1 && yarn && yarn test)
(cd ../targets/ethers && yarn && yarn test)

if [ "$mode" = "COVERAGE" ]; then
  echo "Sending coverage report"
  yarn coveralls
fi
