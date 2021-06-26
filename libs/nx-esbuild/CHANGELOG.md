# @wanews/nx-esbuild

## 0.14.0

### Minor Changes

- f122f2b: Update root tsconfig.json to add project reference
- d133ace: When user specifies a directory, use it without appending apps/libs

## 0.13.0

### Minor Changes

- 289986f: Update configurations, links to git and other tweaks

## 0.12.1

### Patch Changes

- 1a55bad: Fix the error check in nx-esbuild executor to check for the presence of the errors array in the results object

## 0.12.0

### Minor Changes

- d06cf86: Fixed packaging multiple entrypoints having the same zip file name

## 0.11.0

### Minor Changes

- 7822824: Added a esbuild package executor

## 0.10.0

### Minor Changes

- 9921701: Add lint and test targets for all generators

## 0.9.1

### Patch Changes

- be3cc1c: Fix jest config not being updated

## 0.9.0

### Minor Changes

- cdf9fc0: Add missing config files into project generator

## 0.8.0

### Minor Changes

- f281d6e: Improved peer dependency ranges

## 0.7.0

### Minor Changes

- a6f460e: Preserve color in console output off monitored application

## 0.6.2

### Patch Changes

- 95969f0: Fixed serve not starting esbuild in watch mode

## 0.6.1

### Patch Changes

- 368adc4: Fixed same issue for build executor

## 0.6.0

### Minor Changes

- 584d3f5: Allow plugins to have default export

## 0.5.0

### Minor Changes

- 8ea3d11: First pass at allowing plugins

### Patch Changes

- 76cebd4: Fixed no logs coming from esbuild

## 0.4.0

### Minor Changes

- 048a764: Switch to calling esbuild in code & code gen options to expose all esbuild options

## 0.3.1

### Patch Changes

- 4a8831d: Fixed default entry being set when entries set

## 0.3.0

### Minor Changes

- ca0cabe: Include devDependencies in automatic externals
- ca0cabe: Added outdir to go with multiple entrypoints

## 0.2.0

### Minor Changes

- c57c6cb: Add option for multiple entry points

## 0.1.2

### Patch Changes

- 399d03f: Fix builds (properly)

## 0.1.1

### Patch Changes

- 7c8dc88: Fixed built files not being included

## 0.1.0

### Minor Changes

- b075dba: Initial release
