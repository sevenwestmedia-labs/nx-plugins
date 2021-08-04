# @wanews/nx-pulumi

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
