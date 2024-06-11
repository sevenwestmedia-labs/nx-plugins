module.exports = {
  hooks: {
    readPackage,
  },
}

// The jest lib pulls in babel and a number of other deps which we don't want
// this is a hack to get around that and insure they are not installed
// transitively
function readPackage(pkg) {
  if (pkg.name === '@nx/workspace') {
    delete pkg.dependencies['@nx/jest']
  }
  if (pkg.name === '@nx/eslint') {
    delete pkg.dependencies['@nx/jest']
  }
  if (pkg.name === '@nx/plugin') {
    delete pkg.dependencies['@nx/jest']
  }
  return pkg
}
