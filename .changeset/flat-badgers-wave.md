---
'@wanews/nx-pulumi': minor
---

BREAKING: Explicitly specify Pulumi options as NX arguments, removed transparent passthrough

This means if you were passing Pulumi arguments through which are not explicitly defined in the NX config, they will no longer be passed through to the CLI.

NX 14.0 has furthered the behaviour of not passing through arguments to executors which are not in NX config forcing this plugin to be explicit. This means the CLI flags may differ slightly when using the NX executor vs the Pulumi CLI.

NOTE: This change will make the affected behavior in NX work more reliably
