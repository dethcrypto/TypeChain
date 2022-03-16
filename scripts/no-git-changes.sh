#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

if [[ `git status --porcelain` ]]; then
  echo "GIT changes detected! Run pnpm test:fix and commit and changes (especially in test fixtures)."

  git status --verbose --verbose

  exit 1
fi
