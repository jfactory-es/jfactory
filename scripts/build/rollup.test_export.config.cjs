const { commonInput, PRODUCTION } = require('./buildConfig');
module.exports = [
  {
    input: 'test/export-src/promise/export-promise.mjs',
    output: {
      format: 'es',
      entryFileNames: '[name].mjs',
      // helps to check which modules are exported:
      preserveModules: true,
      preserveModulesRoot: 'test/export-src/promise',
      dir: 'test/export-compiled/promise'
    },
    ...commonInput(PRODUCTION)
  }
];