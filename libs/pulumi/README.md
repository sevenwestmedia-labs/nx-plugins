# @wanews/nx-pulumi

NX Plugin for setting up Pulumi projects in an NX repo.

## Usage

### Creating a deployment project

```
nx g @wanews/nx-pulumi:init
```

### Running deploy

@wanews/nx-pulumi will add a `deploy` target to the selected project.

`nx deploy <your-project-name>`

This will start pulumi with a `--cwd` of the infrastructure project automatically. All arguments will be passed onto the pulumi CLI.

`nx deploy my-app --stack dev`

Under the hood, this will run the `up` against your infrastructure project.

### Affected deploys

when using S3 or another state which doesn't include the project name in the state path, a good workaround is naming your stacks `<project-name>.<env>`. For example `my-project.prod`.

```
[projectName].[env]
```

For example if your `name` key in `Pulumi.yaml` is my-infrastructure and you pass `--env prod`, the stack name will be `my-infrastructure.prod`

This allows you to use the NX affected command with Pulumi to deploy all the affected stacks.

#### Configuration

Use the `configurationStackFormat` executor configuration value to change the stack name format.

Current placeholders `[projectName]`, `[environment]`

Default:

`configurationStackFormat='[projectName].[environment]'`

#### Example

```
nx affected --target=up --env=prod --all
# Or in parallel
nx affected --target=up --env=prod --all --parallel --maxParallel=5
```

### Running other pulumi commands

The main reason for having a plugin is to automatically build the target application and allows NX to deploy applications which have changed in the mono repo. Only the `up` command needs to rebuild the target application.

All other commands you can just use the `--cwd apps/<my-app>-infrastructure` flag when running the pulumi CLI

## Troubleshooting

### Error: unknown flag: --nonInteractive (or similar)

NX Mangles command line args, the issue is being tracked at https://github.com/nrwl/nx/issues/5710

You can use `patch-package` to fix the issue:

```
pnpm add -WD patch-package
```

Edit `node_modules/@nrwl/cli/lib/parse-run-one-options.js`

Add this configuration to the yargs initialisation

```
configuration: {
    "camel-case-expansion": false
}
```

run `pnpx patch-package @nrwl/cli` to generate the patch
