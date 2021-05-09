# typechain

## 5.0.0

### Major Changes

- d60a343: Rename `--outDir` CLI option to `--out-dir`
- 5a60d00: Remove dependency on `ts-generator`

### Minor Changes

- d60a343: Add `--always-generate-overloads` option and by default stop generating types for overloaded functions if
  there are no overloads (reduces bloat)

## 4.0.3

### Patch Changes

- dbfe92a: Improve error message in case of a missing target

## 4.0.2

### Patch Changes

- d07ae43: Fix signature of overloaded methods with struct in arguments

## 4.0.1

### Patch Changes

- 82633bb: Do not ship tests and original source files with the npm package
