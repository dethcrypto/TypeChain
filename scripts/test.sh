#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

yarn test:unit

echo "Praparing for integration tests"

cd ./test/integration/contracts/
ABI_DIR="../abis"
rm -rf $ABI_DIR

echo "Generating ABIs for sample contracts"
../../../node_modules/.bin/solcjs --abi ./* --bin -o $ABI_DIR

echo "Generate TypeChain wrappers"
yarn test:generateContracts

yarn test:integration