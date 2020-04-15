#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

bold=$(tput bold)
normal=$(tput sgr0)

for dir in ./examples/* ; do
  echo "Checking example: ${bold}$dir${normal}"

  (cd $dir && yarn && yarn typecheck) 1>/dev/null
done
