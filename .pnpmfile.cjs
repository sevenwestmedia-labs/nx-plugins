module.exports = {
  hooks: {
    readPackage,
  },
}

// The jest lib pulls in babel and a number of other deps which we don't want
// this is a hack to get around that and insure they are not installed
// transitively
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
