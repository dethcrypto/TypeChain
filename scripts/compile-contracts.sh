#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

echo "Cleaning up contracts/abis"
rm -rf ./abis/
mkdir -p ./abis/

echo "Generating ABIs"
./node_modules/solc/solcjs --abi ./contracts/* --bin -o ./abis

echo "Renaming ABIs"
# $ renamer -d --find "/.*_(\d+)_.*/" --replace "Video $1.mp4" *
node ./scripts/rename.js
