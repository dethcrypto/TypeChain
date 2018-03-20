#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

yarn test:unit

echo "Praparing for integration tests"

cd ./test/integration/contracts/
ABI_DIR="../abis"
ABI_TMP_DIR="../../../test-tmp"
rm -rf $ABI_DIR
rm -rf $ABI_TMP_DIR

mkdir $ABI_TMP_DIR 

echo "Generating ABIs for sample contracts"
../../../node_modules/.bin/solcjs --abi ./* --bin -o $ABI_DIR

echo "Generate TypeChain wrappers"
yarn test:generateContracts
echo "test --outdir..."
yarn test:generateContractsOutDir

echo "Testing if there are no complication problems with generated wrappers"
yarn tsc

yarn test:integration