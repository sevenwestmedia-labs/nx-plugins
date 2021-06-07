# @wanews/x-vite

NX Plugin for Next Generation Frontend Tooling with Vite

Vite is a no bundler DEV environment for modern JS frameworks. Vite serves your code via native ES Module imports during development, allowing you to develop your single page application without a bundle step. Vite by design is Lightning fast cold server start and offers Instant hot module replacement and on-demand compilation.

Read more here: https://vitejs.dev/guide/

## Generators

### react

Scaffolds a basic React (Typescript) project.

**Usage**
`npx nx generate @wanews/nx-vite:react <application-name>`

For other templates, see https://github.com/vitejs/vite/tree/main/packages/create-app. You can use the above generator then replace the files with one of the templates in vite or even better add a generator with the template.

## Executors

### build

A [build command](https://vitejs.dev/guide/build.html) that bundles your code with [Rollup](https://rollupjs.org), pre-configured to output highly optimized static assets for production.

#### Options

No extra options have been enabled at the present time.
See `npx vite build --help` for more info on the available options. See below if you think we're missing something important.

### serve

A dev server that serves your source files over [native ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), with [rich built-in features](https://vitejs.dev/guide/features.html) and astonishingly fast [Hot Module Replacement (HMR)](https://vitejs.dev/guide/features.html#hot-module-replacement).

#### Options

No extra options have been enabled at the present time.
See `npx vite serve --help` for more info on the available options. See below if you think we're missing something important.

## An option is missing

Vite is opinionated and comes with sensible defaults out of the box, but is also highly extensible via its Plugin API and JavaScript API with full typing support.

To add options to our generator please...

- Add the option to the schema.json file
- Add the option to the schema.d.ts file
- Consume the option in executor.ts and pass the appropriate cli arg
