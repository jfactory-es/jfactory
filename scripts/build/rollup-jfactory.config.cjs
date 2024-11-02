const del = require('rollup-plugin-delete');
const copy = require('rollup-plugin-copy');
const terser = require('@rollup/plugin-terser');

const {
  PRODUCTION,
  DEVELOPMENT,
  commonOptions,
  commonOutputUMD,
  commonOutputCJS,
  commonOutputES
} = require('./rollup.config.js');

module.exports = [

  // ----------------------------------------------------------------------------------
  // Production
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index.mjs',
    ...commonOptions(PRODUCTION),
    plugins: [
      del({
        targets: [
          'dist/*'
          // 'dist/cjs',
          // 'dist/cjs-devel',
          // 'dist/es',
          // 'dist/es-devel',
          // 'dist/umd',
          // 'dist/cjs-devel',
          // 'dist/index.js',
          // 'dist/jFactory.d.mts'
        ],
        runOnce: true
      }),
      copy({
        targets: [
          {
            src: 'src/jFactory.d.mts',
            dest: 'dist'
          }
        ],
        verbose: true,
        copyOnce: true
      })
    ].concat(commonOptions(PRODUCTION).plugins),
    output: [
      {
        ...commonOutputUMD(PRODUCTION),
        sourcemap: true,
        plugins: [
          terser(/*terserOptions*/)
        ]
      },
      {
        ...commonOutputES(PRODUCTION)
      },
      {
        ...commonOutputCJS(PRODUCTION)
      }
    ]
  },

  // ----------------------------------------------------------------------------------
  // Development
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index.mjs',
    ...commonOptions(DEVELOPMENT),
    output: [
      {
        ...commonOutputUMD(DEVELOPMENT),
        sourcemap: true
      },
      {
        ...commonOutputES(DEVELOPMENT)
      },
      {
        ...commonOutputCJS(DEVELOPMENT)
      }
    ]
  }
];