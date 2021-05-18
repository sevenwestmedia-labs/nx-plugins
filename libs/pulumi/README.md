# @wanews/nx-pulumi

NX Plugin for setting up Pulumi projects in an NX repo.

## Usage

### Creating a deployment project

```
nx g @wanews/nx-pulumi:init
```

### Running deploy

@wanews/nx-pulumi will add a `up` target to the selected project.

`nx up <your-project-name>`

This will start pulumi with a `--cwd` of the infrastructure project automatically. All arguments will be passed onto the pulumi CLI.

`nx up my-app --stack dev`

### Affected deploys

This module uses the `configuration` flag to calculate the stack name. By default it will use the format

```
[projectName].[configuration]
```

For example if your `name` key in `Pulumi.yaml` is my-infrastructure and you pass `--configuration prod`, the stack name will be `my-infrastructure.prod`

### Running other pulumi commands

The main reason for having a plugin is to automatically build the target application and allows NX to deploy applications which have changed in the mono repo. Only the `up` command needs to rebuild the target application.

All other commands you can just use the `--cwd apps/<my-app>-infrastructure` flag when running the pulumi CLI

## Running unit tests

Run `nx test pulumi` to execute the unit tests via [Jest](https://jestjs.io).
