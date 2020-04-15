#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

for dir in ./examples/* ; do
  echo "Checking example: $dir"

  (cd $dir && yarn && yarn typecheck) 1>/dev/null
done
