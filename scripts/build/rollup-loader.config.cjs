const { bannerProd } = require('./rollup.config.cjs');

module.exports = [
  {
    input: 'src/index-loader.cjs',
    output: [
      {
        format: 'cjs',
        entryFileNames: 'index-loader.cjs',
        banner: bannerProd,
        strict: false,
        dir: 'dist'
      }
    ]
  },
  {
    input: 'src/index-loader.mjs',
    external: [
      'jfactory/es',
      'jfactory/es-devel'
    ],
    treeshake: false,
    output: [
      {
        format: 'es',
        entryFileNames: 'index-loader.mjs',
        banner: bannerProd,
        footer: async () => {
          global.JFACTORY_ENV_LOG = 0; // 0 => skip boot logs
          const lib = await import('jfactory/es-devel');
          const exportKeys = Object.keys(lib);
          return (
            `const {\n    ${exportKeys.join(',\n    ')}\n} = lib;\n\n` +
            `export {\n    ${exportKeys.join(',\n    ')}\n};`
          )
        },
        strict: false,
        dir: 'dist'
      }
    ]
  }
];