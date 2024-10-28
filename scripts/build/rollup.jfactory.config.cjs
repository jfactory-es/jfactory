const terserPlugin = require('@rollup/plugin-terser');
const copy = require('rollup-plugin-copy');

const {
  PRODUCTION,
  DEVELOPMENT,
  commonOptions,
  commonOutputUMD,
  commonOutputCJS,
  commonOutputES,
  bannerProd
} = require('./buildConfig.js');

module.exports = [

  // ----------------------------------------------------------------------------------
  // index.cjs
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index-loader.cjs',
    plugins: [
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
    ],
    output: [
      {
        format: 'cjs',
        entryFileNames: 'index.js',
        banner: bannerProd,
        strict: false,
        dir: 'dist'
      }
    ]
  },

  // ----------------------------------------------------------------------------------
  // Production
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index.mjs',
    ...commonOptions(PRODUCTION),
    output: [
      {
        ...commonOutputUMD(PRODUCTION),
        sourcemap: true,
        plugins: [
          terserPlugin(/*terserOptions*/)
        ]
      },
      {
        ...commonOutputES(PRODUCTION)
      },
      {
        ...commonOutputCJS(PRODUCTION),
        sourcemap: true
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
        ...commonOutputCJS(DEVELOPMENT),
        sourcemap: true
      }
    ]
  }
];