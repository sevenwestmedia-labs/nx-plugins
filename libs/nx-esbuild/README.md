# nx-esbuild

NX Plugin to build your node apps using ESBuild and can serve it by watching the bundle with nodemon

## Generators

### node

Creates a new node application.

- dependencies in package.json will automatically get marked as externals

## Executors

### build

Bundles your node application

#### Options

The available options are listed in libs/nx-esbuild/src/executors/build/schema.json

See https://esbuild.github.io/api/#simple-options for more info on the available options

### package

Primarily designed when bundling lambdas, it will ensure node_modules is installed into dist for each entrypoint, then zips the output folder (ready to be uploaded to AWS)

NOTE: Currently only supports pnpm

#### Externals & node_modules

If you create a package.json next to the entrypoint, it will be used instead of the project package.json. This is useful when you have a specific lambda have less dependencies installed than the project has. Externals will only ever use the root package.json (so it should always be a superset of the lambda entrypoint package.json)

#### Options

The available options are listed in libs/nx-esbuild/src/executors/build/schema.json

See https://esbuild.github.io/api/#simple-options for more info on the available options

### serve

Bundles your node application in watch mode, then starts nodemon to watch the bundle

#### Options

The available options are listed in llibs/nx-esbuild/src/executors/serve/schema.json

See https://esbuild.github.io/api/#simple-options for more info on the available options

## An option is missing

I have just added the options I needed to start with, to add another just

- Add the option to the schema.json file
- Add the option to the schema.d.ts file
- Consume the option in executor.ts and pass the appropriate cli arg
