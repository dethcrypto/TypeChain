#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [[ `git status --porcelain` ]]; then
  echo "GIT changes detected! Run yarn test:fix and commit and changes (especially in test fixtures)."

  git --no-pager diff

  exit 1
fi