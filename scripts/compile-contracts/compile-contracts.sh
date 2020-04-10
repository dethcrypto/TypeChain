#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ../..

IN_DIR=./contracts
OUT_DIR=./contracts/compiled

echo "Cleaning up contracts/abis"
rm -rf ${OUT_DIR}

echo "Generating ABIs"
./node_modules/solc/solcjs --abi ${IN_DIR}/* --bin -o ${OUT_DIR}

echo "Renaming ABIs"
node ./scripts/compile-contracts/rename.js

echo "Copy truffle contracts"
node ./scripts/compile-contracts/truffle-copy.js
