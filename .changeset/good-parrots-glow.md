---
'@wanews/nx-pulumi': minor
---

Breaking change: this module now adds the `up` target to the infrastructure project.

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

