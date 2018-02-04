#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

yarn test:unit

echo "Praparing for integration tests"

ABI_DIR="./test/integration/abis"
ABI_TMP_DIR="./test-tmp"
rm -rf $ABI_DIR
rm -rf $ABI_TMP_DIR

mkdir $ABI_TMP_DIR 

echo "Generating ABIs for sample contracts"
solc --abi ./test/integration/contracts/* --bin -o $ABI_DIR

echo "Generate Typechain wrappers"
yarn test:generateContracts
echo "test --outdir..."
yarn test:generateContractsOutDir

yarn test:integration