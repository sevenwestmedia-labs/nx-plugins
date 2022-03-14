# @wanews/nx-esbuild

## 0.20.0

### Minor Changes

- [`64fba7b`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/64fba7b4dcb7667271e75537ea53aba521553ba5) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add singleZip option

### Patch Changes

- [`23526c1`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/23526c122db6b5c13ccfaa2ba9255e38fa5a5436) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Allow multiple serve entrypoints if user is providing serve command

## 0.19.1

### Patch Changes

- [`3f8e869`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/3f8e869717d3481944581c79939eab4183b218d2) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed beforeZip validation issue

## 0.19.0

### Minor Changes

- [#66](https://github.com/sevenwestmedia-labs/nx-plugins/pull/66) [`3092877`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/30928777dc2ea63840c1121f7748b7fe3358a3e0) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add beforeZip command hook for pacakge executor

* [#65](https://github.com/sevenwestmedia-labs/nx-plugins/pull/65) [`9a4ad20`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/9a4ad20c2f53057cb426690789482afa656003ca) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Allow custom serveCommand for esbuild serve executor

## 0.18.0

### Minor Changes

- [`f81bd77`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/f81bd77328db20a35e951a864fd3e658ac847395) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgrate nx from 12.x to 13.x

## 0.17.0

### Minor Changes

- [#61](https://github.com/sevenwestmedia-labs/nx-plugins/pull/61) [`240b901`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/240b9018b59ce41221935d41e3538d21758d0c1d) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgrate nx from 12.x to 13.x

## 0.16.2

### Patch Changes

- [`40cdad5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/40cdad5502ec6e4c13c008dab0fe586fe25cd12c) Thanks [@bennettp123](https://github.com/bennettp123)! - Bump depoendencies

## 0.16.1

### Patch Changes

- [#53](https://github.com/sevenwestmedia-labs/nx-plugins/pull/53) [`6cd29e3`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/6cd29e3a7ef510bf72963eb2958ea23a9919d043) Thanks [@bennettp123](https://github.com/bennettp123)! - Upgrade nx to 12.10.0

## 0.16.0

### Minor Changes

- [`e1265d5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/e1265d5c6feac19fcc9892c1ec8cb8634b285e13) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed a number of missing peer dependencies and dependencies

## 0.15.2

### Patch Changes

- [`b46e10d`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/b46e10d96a2fd9e8d974a066fb56db3a5b2438e1) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed crash when project doesn't have a package.json

## 0.15.1

### Patch Changes

- ad97d64: hotfix: check for yarn.lock in workspace root

## 0.15.0

### Minor Changes

- 1763c9f: add support for the yarn package manager

## 0.14.1

### Patch Changes

- 66b63f1: Use relative path for root tsconfig references

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
