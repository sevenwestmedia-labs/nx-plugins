# @wanews/nx-typescript-project-references

Converts an NX repo to take advantage of TypeScript project references.

## Installation

```
pnpm add -WD @wanews/nx-typescript-project-references
```

## Generators

### Upgrade a repo

```
pnpx nx generate @wanews/nx-typescript-project-references:migrate
```

### Library generator

```
pnpx nx generate @wanews/nx-typescript-project-references:library
```

If you want to publish the library remove `"private": true` from package.json.

Because `main` serves two purposes, one for TypeScript project references (`out-dist/index.js`) and the published package (`dist/index.js`) this generator comes with a prepack and postpublish step to update the references in package.json.

See scripts/prepack.js and scripts/postpack.js

## Executors

### package

`executor: '@wanews/nx-typescript-project-references:package'`
