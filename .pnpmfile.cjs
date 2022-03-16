module.exports = {
  hooks: {
    readPackage(pkg, _ctx) {
      // We silence known peer dependency warnings which are not relevant to TypeChain
      if (pkg.name === '@improbable-eng/grpc-web') delete pkg.peerDependencies['google-protobuf']
      if (pkg.name === 'native-fetch') delete pkg.peerDependencies['node-fetch']
      if (pkg.name === 'native-abort-controller') delete pkg.peerDependencies['abort-controller']

      return pkg
    },
  },
}
