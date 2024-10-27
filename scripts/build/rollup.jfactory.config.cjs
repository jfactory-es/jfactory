const terserPlugin = require('@rollup/plugin-terser');
const copy = require('rollup-plugin-copy');

const {
  PRODUCTION,
  DEVELOPMENT,
  commonInput,
  commonOutputES,
  commonOutputUMD,
  bannerProd
} = require('./buildConfig.js');

module.exports = [

  // ----------------------------------------------------------------------------------
  // index.js
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index.js',
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
    output: {
      format: 'cjs',
      entryFileNames: 'index.js',
      banner: bannerProd,
      strict: false,
      dir: 'dist'
    }
  },

  // ----------------------------------------------------------------------------------
  // Production
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index.mjs',
    output: [
      {
        ...commonOutputUMD(PRODUCTION),
        // sourcemap: true,
        plugins: [
          terserPlugin(/*terserOptions*/)
        ]
      },
      {
        ...commonOutputES(PRODUCTION)
      }
    ],
    ...commonInput(PRODUCTION)
  },

  // ----------------------------------------------------------------------------------
  // Development
  // ----------------------------------------------------------------------------------
  {
    input: 'src/index.mjs',
    output: [
      {
        ...commonOutputUMD(DEVELOPMENT)
      },
      {
        ...commonOutputES(DEVELOPMENT)
        // sourcemap: true,
      }
    ],
    ...commonInput(DEVELOPMENT)
  }
];