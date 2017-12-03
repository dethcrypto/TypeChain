#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

yarn test:unit

echo "Praparing for integration tests"

ABI_DIR="./test/integration/abis"
rm -rf $ABI_DIR

echo "Generating ABIs for sample contracts"
solc --abi ./test/integration/contracts/* --bin -o $ABI_DIR

echo "Generate Typechain wrappers"
yarn test:generateContracts

yarn test:integration