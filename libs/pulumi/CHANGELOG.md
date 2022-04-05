# @wanews/nx-pulumi

## 0.19.0

### Minor Changes

- [#67](https://github.com/sevenwestmedia-labs/nx-plugins/pull/67) [`3b4eff0`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/3b4eff08f19a77ec4c9088f0ae8a78c9e28780d5) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Switch from @nrwl/tao to nx and aws-sdk to aws sdk v3

## 0.18.6

### Patch Changes

- [`40cdad5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/40cdad5502ec6e4c13c008dab0fe586fe25cd12c) Thanks [@bennettp123](https://github.com/bennettp123)! - Bump depoendencies

## 0.18.5

### Patch Changes

- [#53](https://github.com/sevenwestmedia-labs/nx-plugins/pull/53) [`6cd29e3`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/6cd29e3a7ef510bf72963eb2958ea23a9919d043) Thanks [@bennettp123](https://github.com/bennettp123)! - Upgrade nx to 12.10.0

## 0.18.4

### Patch Changes

- [#52](https://github.com/sevenwestmedia-labs/nx-plugins/pull/52) [`8e1859a`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/8e1859a081d9c6931cb6b5e8d35cbce36cd5df1d) Thanks [@wimoMisterX](https://github.com/wimoMisterX)! - Fixed regression in --removePendingOperations in destroy-stack generator caused by #51

## 0.18.3

### Patch Changes

- [`b50dd93`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/b50dd93833ad95ba3f8aaf020f239d6d0a38a0cc) Thanks [@wimoMisterX](https://github.com/wimoMisterX)! - Added the logic to remove pending operations in the `destroy-stack` generator
  Remove the stack before deleting the stack config in the `destroy-stack` generator
  Added --ignorePendingCreateOperations flag to the `destroy-stack` generator

## 0.18.2

### Patch Changes

- [#50](https://github.com/sevenwestmedia-labs/nx-plugins/pull/50) [`4ad91ab`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4ad91ab766246576fb77c9d457e7cfc0f13778aa) Thanks [@wimoMisterX](https://github.com/wimoMisterX)! - Fixed destroy-stack generator failing when --yes is passed

## 0.18.1

### Patch Changes

- [#49](https://github.com/sevenwestmedia-labs/nx-plugins/pull/49) [`4049eb2`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4049eb2b5f36a2b12aec9fc73341dabac7cb515b) Thanks [@wimoMisterX](https://github.com/wimoMisterX)! - Fixed invalid args passed to pulumi stack init

## 0.18.0

### Minor Changes

- [#42](https://github.com/sevenwestmedia-labs/nx-plugins/pull/42) [`2313ab5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/2313ab5d35f80aed603b2d2e977896d3673dd4fc) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add a number of additional executors which make it easier to implement branch deploys

## 0.17.0

### Minor Changes

- [`e1265d5`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/e1265d5c6feac19fcc9892c1ec8cb8634b285e13) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed a number of missing peer dependencies and dependencies

## 0.16.0

### Minor Changes

- [#46](https://github.com/sevenwestmedia-labs/nx-plugins/pull/46) [`23d2213`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/23d221334203d4d00cf09976a0af216dc8855f02) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - BREAKING: Removed duplicate config options. Use `buildTargets` to build dependencies

## 0.15.1

### Patch Changes

- [`c2b8a9c`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/c2b8a9c338f1a62f9dc133695ac54c9cfbca1020) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed init-standalone

## 0.15.0

### Minor Changes

- 55e897c: Skip build steps when up will not be performed

## 0.14.0

### Minor Changes

- fa04d40: Add standalone infrastructure project generator

## 0.13.1

### Patch Changes

- 8801ee6: Ensure task fails when pulumi does not have an exit code of 0

## 0.13.0

### Minor Changes

- 2ceca1e: Breaking change: this module now adds the `up` target to the infrastructure project.

  Since the `up` target expects to be on the infrastructure project, existing projects may need to override the infrastructure project in `workspace.yaml`.

  For example, with the following `worspace.yaml` created with 0.12:

  ```
  {
    "version": 2,
    "projects": {
      "hello-world": {
        "root": "apps/hello-world",
        "projectType": "application",
        "sourceRoot": "apps/hello-world/src",
        "targets": {
          "build": { ... },
  	"up": {
            "executor": "@wanews/nx-pulumi:up",
  	  "options": {
              "targetProjectName": "hello-world"
  	  }
  	}
        }
      },
      "hello-world-infrastructure": {
        "root": "apps/hello-world",
        "projectType": "application",
        "sourceRoot": "apps/hello-world/src",
        "targets": {
          "build": { ... }
        }
      }
    }
  }
  ```

  In 0.13+, the `up` target moves to the infrastructure project:

  ```
  {
    "version": 2,
    "projects": {
      "hello-world": {
        "root": "apps/hello-world",
        "projectType": "application",
        "sourceRoot": "apps/hello-world/src",
        "targets": {
          "build": { ... }
        }
      },
      "hello-world-infrastructure": {
        "root": "apps/hello-world",
        "projectType": "application",
        "sourceRoot": "apps/hello-world/src",
        "targets": {
          "build": { ... },
          "up": {
            "executor": "@wanews/nx-pulumi:up",
            "options": {
              "targetProjectName": "hello-world"
            }
          }
        }
      }
    }
  }
  ```

  For convenience, the generator also adds a `deploy` target to the non-infrastructure project, which is an alias for the `up` target on the infrastructure project.

## 0.12.1

### Patch Changes

- 8f0d161: fix a console output bug when targetProjectName is undefined

## 0.12.0

### Minor Changes

- 6cfdb73: allow "infrastructure-only" projects

## 0.11.0

### Minor Changes

- 3cf0e8b: Introduce --env to trigger convention based stack name

## 0.10.1

### Patch Changes

- 7dd9516: update schema.json

## 0.10.0

### Minor Changes

- 833aace: allow overriding infrastructure project name in workspace.json

### Patch Changes

- c4a7a3f: fix a bug affecting console output

## 0.9.1

### Patch Changes

- 66b63f1: Use relative path for root tsconfig references

## 0.9.0

### Minor Changes

- f122f2b: Update root tsconfig.json to add project reference

## 0.8.1

### Patch Changes

- 527dc0c: Add troubleshooting info for nx mangling cli args

## 0.8.0

### Minor Changes

- 289986f: Update configurations, links to git and other tweaks

## 0.7.0

### Minor Changes

- a9d08e8: Add support for calculating stack name for affected:up

## 0.6.0

### Minor Changes

- 9921701: Add lint and test targets for all generators
- 9921701: Update babel config so regenerator runtime is not needed

## 0.5.1

### Patch Changes

- be3cc1c: Fix jest config not being updated

## 0.5.0

### Minor Changes

- 3a2e038: Add template files for esbuild generator

## 0.4.0

### Minor Changes

- b92ec0c: Fixed types and improved logging of pulumi plugin and upgraded deps

## 0.3.0

### Minor Changes

- 745732a: Allow additional targets to be run before up

## 0.2.0

### Minor Changes

- 3dc37c8: Allow buildTarget to be set

## 0.1.2

### Patch Changes

- e4d1a16: Improve logging
- e4d1a16: Fix cwd being incorrect

## 0.1.1

### Patch Changes

- 35b3bab: Fixed build step in NPM package

## 0.1.0

### Minor Changes

- 7ba921a: Initial release of pulumi nx plugin
