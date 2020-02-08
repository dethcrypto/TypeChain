#!/usr/bin/env bash
set -e
if [ -n "$DEBUG" ]; then
  set -x
fi
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
# removing any generated files because tests will regenerate them
rm -rf "test/integration/targets/truffle/@types" 
rm -rf "test/integration/targets/web3-v1/types/web3-v1-contracts" 
rm -rf "test/integration/targets/web3-v2/types/web3-v2-contracts" 
rm -rf "test/integration/targets/ethers/types/ethers-contracts" 
if [ "$mode" = "COVERAGE" ]; then
  yarn test:mocha:coverage
else
  yarn test:mocha
fi

echo "Type checking generated wrappers"
yarn tsc --noUnusedParameters
echo "--truffle"
yarn tsc:truffle
(cd ../targets/truffle && TS_NODE_FILES=true ../../../../node_modules/.bin/truffle test)
echo "--web3-v1"
(cd ../targets/web3-v1 && yarn && yarn test)
echo "--web3-v2"
(cd ../targets/web3-v2 && yarn && yarn test)
echo "--ethers"
(cd ../targets/ethers && yarn && yarn test)

if [ "$mode" = "COVERAGE" ]; then
  echo "Sending coverage report"
  yarn coveralls
fi
