#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

mode=$1

echo "Cleanup"

cd ./test/integration/contracts/
ABI_DIR="../abis"
ABI_TMP_DIR="../../../test-tmp"
rm -rf $ABI_DIR
rm -rf $ABI_TMP_DIR

mkdir $ABI_TMP_DIR 

echo "Generating ABIs for sample contracts"
../../../node_modules/.bin/solcjs --abi ./* --bin -o $ABI_DIR

if [ "$mode" = "COVERAGE" ]; then
  yarn test:mocha:coverage
else
  yarn test:mocha
fi

echo "Testing if there are no complication problems with generated wrappers"
yarn tsc

echo "Sending coverage report"
if [ "$mode" = "COVERAGE" ]; then
  yarn coveralls
fi