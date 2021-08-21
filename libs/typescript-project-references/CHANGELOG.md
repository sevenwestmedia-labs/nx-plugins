# @wanews/nx-typescript-project-references

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
