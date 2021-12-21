module.exports = {
  hooks: {
    readPackage,
  },
}

function readPackage(pkg) {
  if (pkg.name === '@nrwl/workspace') {
    delete pkg.dependencies['@nrwl/jest']
  }
  if (pkg.name === '@nrwl/linter') {
    delete pkg.dependencies['@nrwl/jest']
  }
  if (pkg.name === '@nrwl/nx-plugin') {
    delete pkg.dependencies['@nrwl/jest']
  }
  return pkg
}
