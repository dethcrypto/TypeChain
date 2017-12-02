#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

ABI_DIR="./test/abis"

rm -rf $ABI_DIR

echo "Generating ABIs for sample contracts"
solc --abi ./test/contracts/* -o $ABI_DIR

#echo "Running tests"
#yarn test