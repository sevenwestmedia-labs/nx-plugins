# nx-vite

NX Plugin for Next Generation Frontend Tooling with Vite

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

### serve

Bundles your node application in watch mode, then starts nodemon to watch the bundle

#### Options

The available options are listed in libs/nx-vite/src/executors/serve/schema.json

See https://vitejs.dev/guide/#command-line-interface for more info on the available options

## An option is missing

I have just added the options I needed to start with, to add another just...

- Add the option to the schema.json file
- Add the option to the schema.d.ts file
- Consume the option in executor.ts and pass the appropriate cli arg
