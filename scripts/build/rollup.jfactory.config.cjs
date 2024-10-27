const terserPlugin = require('@rollup/plugin-terser');
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
    output: {
      format: 'cjs',
      entryFileNames: 'index.js',
      banner: bannerProd,
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