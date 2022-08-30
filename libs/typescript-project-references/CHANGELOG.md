# @wanews/nx-typescript-project-references

## 0.21.0

### Minor Changes

- [#90](https://github.com/sevenwestmedia-labs/nx-plugins/pull/90) [`4408cd2`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4408cd2c6c47de3152a5afb9311f5aed986a619e) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgrade depedencies

## 0.20.1

### Patch Changes

- [`34f9100`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/34f910056a8e6d7b8cfc084997e13210b22f39fe) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed incompatibility with latest NX release

## 0.20.0

### Minor Changes

- [#72](https://github.com/sevenwestmedia-labs/nx-plugins/pull/72) [`4848093`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4848093ffb894fbbc3265acfde9463046e716cd7) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgraded dependencies

## 0.19.0

### Minor Changes

- [#70](https://github.com/sevenwestmedia-labs/nx-plugins/pull/70) [`44b8aa1`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/44b8aa181e74bd153c28a270a0ac23fb60212a3e) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Bumped minimum NX version due to internal structure changes

### Patch Changes

- [#70](https://github.com/sevenwestmedia-labs/nx-plugins/pull/70) [`44b8aa1`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/44b8aa181e74bd153c28a270a0ac23fb60212a3e) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed some internal modules in NX being moved

## 0.18.0

### Minor Changes

- [#67](https://github.com/sevenwestmedia-labs/nx-plugins/pull/67) [`3b4eff0`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/3b4eff08f19a77ec4c9088f0ae8a78c9e28780d5) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Switch from @nrwl/tao to nx and aws-sdk to aws sdk v3

## 0.17.1

### Patch Changes

- [`b23a569`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/b23a5699e8523b9de33c6fa312f08a26d796ee70) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed package manager command

## 0.17.0

### Minor Changes

- [`0a300b6`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/0a300b66d8433b96af9e18e5c1cd2757765fede4) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed entrypoint schema & added tsup as a dependency

## 0.16.0

### Minor Changes

- [`f81bd77`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/f81bd77328db20a35e951a864fd3e658ac847395) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgrate nx from 12.x to 13.x

## 0.15.0

### Minor Changes

- [#61](https://github.com/sevenwestmedia-labs/nx-plugins/pull/61) [`240b901`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/240b9018b59ce41221935d41e3538d21758d0c1d) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Turn off legacyOutput by default & allow multiple entrypoints for package step

## 0.14.3

### Patch Changes

- [`40cdad5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/40cdad5502ec6e4c13c008dab0fe586fe25cd12c) Thanks [@bennettp123](https://github.com/bennettp123)! - Bump depoendencies

## 0.14.2

### Patch Changes

- [#54](https://github.com/sevenwestmedia-labs/nx-plugins/pull/54) [`ec894e1`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/ec894e17592fa091ff5ec3837ce1268d0022aa94) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed usage in NX 13

## 0.14.1

### Patch Changes

- [#53](https://github.com/sevenwestmedia-labs/nx-plugins/pull/53) [`6cd29e3`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/6cd29e3a7ef510bf72963eb2958ea23a9919d043) Thanks [@bennettp123](https://github.com/bennettp123)! - Upgrade nx to 12.10.0

## 0.14.0

### Minor Changes

- [`e1265d5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/e1265d5c6feac19fcc9892c1ec8cb8634b285e13) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed a number of missing peer dependencies and dependencies

## 0.13.0

### Minor Changes

- [`f38fc51`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/f38fc5172fdce0dda14523b21e2fc14b9ba49a0c) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Allow external option to be passed to typescript-project-references package executor

### Patch Changes

- [`b46e10d`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/b46e10d96a2fd9e8d974a066fb56db3a5b2438e1) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed crash when project doesn't have a package.json

## 0.12.1

### Patch Changes

- 66b63f1: Use relative path for root tsconfig references

## 0.12.0

### Minor Changes

- f122f2b: Update root tsconfig.json to add project reference
- d133ace: When user specifies a directory, use it without appending apps/libs

## 0.11.0

### Minor Changes

- 18bc28f: Mark dependencies and peerDependencies as externals when packaging

## 0.10.2

### Patch Changes

- da49fff: Add module out

## 0.10.1

### Patch Changes

- 38b3ef0: Fixed tsconfig.json compiling to wrong folder

## 0.10.0

### Minor Changes

- 289986f: Update configurations, links to git and other tweaks

## 0.9.0

### Minor Changes

- 9921701: Add lint and test targets for all generators
- 9921701: Update babel config so regenerator runtime is not needed

## 0.8.3

### Patch Changes

- be3cc1c: Fix jest config not being updated

## 0.8.2

### Patch Changes

- a25c803: Prevents tsconfig.base being overwritten

## 0.8.1

### Patch Changes

- ea011a4: Fixed method of updating tsconfig.base paths

## 0.8.0

### Minor Changes

- 88e1539: Adds generated project path to tsconfig.base.json

## 0.7.1

### Patch Changes

- 048a764: Better handling of projects with no dependencies in migrator

## 0.7.0

### Minor Changes

- 46ffaa8: Update typescript references based on NX dep graph

## 0.6.0

### Minor Changes

- fdfeace: Fixed project tsconfig always being overwritten

## 0.5.0

### Minor Changes

- 71521bc: Make less disruptive when run again

## 0.4.2

### Patch Changes

- 161f951: tsconfig root file paths now are prefixed with ./
  Created package.jsons from migration are marked as private
  Removed tslib from created package.json

## 0.4.1

### Patch Changes

- 4ba9991: Fix crash when parser options has already been removed

## 0.4.0

### Minor Changes

- 3905299: Log when generating type definitions when packaging so it doesn't look like it's hanging

## 0.3.2

### Patch Changes

- 82922e5: Fixed workspace config being incorrect after library generation

## 0.3.1

### Patch Changes

- 1e89787: Remove tslib peer dependency from library generator

## 0.3.0

### Minor Changes

- 6b22065: Allow a separate package name to be specified for libraries

## 0.2.1

### Patch Changes

- 6f6cc70: Fixed crash when babel has no presets

## 0.2.0

### Minor Changes

- 80eda06: Add library generator

## 0.1.2

### Patch Changes

- 399d03f: Fix builds (properly)

## 0.1.1

### Patch Changes

- 7c8dc88: Fixed built files not being included

## 0.1.0

### Minor Changes

- b075dba: Initial release
