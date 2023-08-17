# @wanews/nx-pulumi

## 0.27.0

### Minor Changes

- [#101](https://github.com/sevenwestmedia-labs/nx-plugins/pull/101) [`0bdd538`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/0bdd5385399e380cbebaebbc613d2a965a91daaf) Thanks [@PatrickMilroy](https://github.com/PatrickMilroy)! - Allow passing in Environment Variables by `--envVars=` arguement

## 0.26.0

### Minor Changes

- [#95](https://github.com/sevenwestmedia-labs/nx-plugins/pull/95) [`153fb56`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/153fb5659c3037625f855e7b039567fc5f1a034d) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add refresh flag to up executor

- [#95](https://github.com/sevenwestmedia-labs/nx-plugins/pull/95) [`153fb56`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/153fb5659c3037625f855e7b039567fc5f1a034d) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Add refresh and destroy executors

## 0.25.0

### Minor Changes

- [#90](https://github.com/sevenwestmedia-labs/nx-plugins/pull/90) [`4408cd2`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4408cd2c6c47de3152a5afb9311f5aed986a619e) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgrade depedencies

## 0.24.0

### Minor Changes

- [#89](https://github.com/sevenwestmedia-labs/nx-plugins/pull/89) [`63571c0`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/63571c09fa7aec3a29f7f4fd31d64791a5e581e0) Thanks [@eemelipa](https://github.com/eemelipa)! - Add yes and skipPreview flags to Pulumi destroy-stack generator

## 0.23.0

### Minor Changes

- [#88](https://github.com/sevenwestmedia-labs/nx-plugins/pull/88) [`e8a452f`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/e8a452fbe2cf8970d08154c138cf69effd676109) Thanks [@eemelipa](https://github.com/eemelipa)! - Add skip preview configuration to Pulumi up executor

## 0.22.6

### Patch Changes

- [#86](https://github.com/sevenwestmedia-labs/nx-plugins/pull/86) [`4597df7`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4597df7e3de94c2e17caff1acf208adddb565424) Thanks [@eemelipa](https://github.com/eemelipa)! - Fix test command path in generate init template

## 0.22.5

### Patch Changes

- [#85](https://github.com/sevenwestmedia-labs/nx-plugins/pull/85) [`9736ca4`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/9736ca44dddf7318b81217fc4dfe0648e871d835) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed restore config not writing the file correctly

## 0.22.4

### Patch Changes

- [#81](https://github.com/sevenwestmedia-labs/nx-plugins/pull/81) [`f95fba8`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/f95fba8f96ebe450a88851ecfa285ff699c734e9) Thanks [@mattfysh](https://github.com/mattfysh)! - Fix readme commands

## 0.22.3

### Patch Changes

- [#84](https://github.com/sevenwestmedia-labs/nx-plugins/pull/84) [`980834e`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/980834e1b473e2f826c18e869a22433db18eac11) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed create-stack generator not respecting --dry-run

## 0.22.2

### Patch Changes

- [#79](https://github.com/sevenwestmedia-labs/nx-plugins/pull/79) [`ee7a533`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/ee7a533aba5e222499af2f2e92adfbe506e808a9) Thanks [@spike008t](https://github.com/spike008t)! - fix: add cwd arg on pulumi command for destroy generator

## 0.22.1

### Patch Changes

- [#78](https://github.com/sevenwestmedia-labs/nx-plugins/pull/78) [`4796baf`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4796baf6921f3a556491ae7040e44b86a024586b) Thanks [@spike008t](https://github.com/spike008t)! - fix(generators): wrong required field name

## 0.22.0

### Minor Changes

- [#76](https://github.com/sevenwestmedia-labs/nx-plugins/pull/76) [`59f45ed`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/59f45ed2ef6ef6ca11e207af99d2e02ca7cd806c) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - BREAKING: Explicitly specify Pulumi options as NX arguments, removed transparent passthrough

  This means if you were passing Pulumi arguments through which are not explicitly defined in the NX config, they will no longer be passed through to the CLI.

  NX 14.0 has furthered the behaviour of not passing through arguments to executors which are not in NX config forcing this plugin to be explicit. This means the CLI flags may differ slightly when using the NX executor vs the Pulumi CLI.

  NOTE: This change will make the affected behavior in NX work more reliably

## 0.21.1

### Patch Changes

- [`34f9100`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/34f910056a8e6d7b8cfc084997e13210b22f39fe) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Fixed incompatibility with latest NX release

## 0.21.0

### Minor Changes

- [#72](https://github.com/sevenwestmedia-labs/nx-plugins/pull/72) [`4848093`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/4848093ffb894fbbc3265acfde9463046e716cd7) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Upgraded dependencies

## 0.20.0

### Minor Changes

- [#70](https://github.com/sevenwestmedia-labs/nx-plugins/pull/70) [`44b8aa1`](https://github.com/sevenwestmedia-labs/nx-plugins/commit/44b8aa181e74bd153c28a270a0ac23fb60212a3e) Thanks [@JakeGinnivan](https://github.com/JakeGinnivan)! - Bumped minimum NX version due to internal structure changes

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
