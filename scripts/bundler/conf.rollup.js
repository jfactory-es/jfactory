// -------------------------------
// Bundle configuration (/dist)
// -------------------------------

const { getEnv } = require("../env");
const { terser } = require("rollup-plugin-terser");
const replace = require("@rollup/plugin-replace");
const pkg = require("../../package.json");
const fs = require("fs");

const DEBUG = getEnv("DEBUG") === true; // true: dev mode. beautify output, more logs, allows debugger keyword
const BUNDLE = getEnv("BUNDLE") === true;
const VERSION = "v" + pkg.version;

const SOURCEMAP = true; // .map
// const SOURCEMAP = "inline";

module.exports = [];

const config = {
  input: "src/index.mjs",
  external: ["lodash", "jquery"],
  treeshake: {
    // see https://rollupjs.org/guide/en/#treeshake
    annotations: true, // allows  @__PURE__ or #__PURE__
    moduleSideEffects: false, // unused module never has side-effects. Can be a list or function
    unknownGlobalSideEffects: false, // reading an unknown global never has side-effect
    propertyReadSideEffects: false, // reading a property of an object has side-effect
    tryCatchDeoptimization: false // disable optimization inside try catch
  }
};

const config_output = {
  globals: {
    lodash: "_",
    jquery: "$"
  },
  interop: false,
  banner: fs.readFileSync("scripts/bundler/dist-header.mjs", "utf8").replace("COMPILER_VER", VERSION)
};

const config_replace = {
  COMPILER_VER: VERSION,
  COMPILER_DEBUG: DEBUG,
  COMPILER_CLI: undefined
};

const config_terser = {
  output: {
    beautify: DEBUG,
    comments: DEBUG ? true : "some"
  },
  keep_classnames: DEBUG,
  keep_fnames: DEBUG,
  mangle: !DEBUG,
  toplevel: true,
  compress: {
    ecma: 2020,
    drop_console: false,
    drop_debugger: !DEBUG
  }
};

const config_terser_devel = {
  ...config_terser,
  // output: {
  //   ...config_terser.output
  // },
  // compress: {
  //   ...config_terser.compress
  // },
  keep_classnames: true,
  keep_fnames: true
};

if (!BUNDLE) { // simplified build for development

  module.exports.push({
    ...config,
    output: {
      ...config_output,
      file: pkg.main,
      format: "cjs",
      sourcemap: SOURCEMAP
    },
    plugins: [
      replace({
        ...config_replace,
        COMPILER_DEV: true
      })
    ]
  })

} else { // full "dist" build

  const plugins_prod = [
    replace({
      ...config_replace,
      COMPILER_DEV: false
    }),
    terser(config_terser)
  ];

  const plugins_dev = [
    replace({
      ...config_replace,
      COMPILER_DEV: true
    }),
    terser(config_terser_devel)
  ];

  module.exports.push(

    { // loader
      ...config,
      input: "scripts/bundler/dist-index.js",
      output: {
        ...config_output,
        format: "cjs",
        file: pkg.main,
        interop: false
      }
    },

    { // prod cjs
      ...config,
      output: {
        ...config_output,
        format: "cjs",
        file: "dist/jFactory.cjs.js",
        sourcemap: DEBUG ? SOURCEMAP : false
      },
      plugins: plugins_prod
    },

    { // prod umd
      ...config,
      output: {
        ...config_output,
        format: "umd",
        name: "jFactoryModule",
        file: "dist/jFactory.umd.js",
        sourcemap: DEBUG ? SOURCEMAP : false
      },
      plugins: plugins_prod
    },

    { // prod mjs
      ...config,
      output: {
        ...config_output,
        format: "es",
        file: "dist/jFactory.mjs",
        sourcemap: DEBUG ? SOURCEMAP : false
      },
      plugins: plugins_prod
    },

    { // dev cjs
      ...config,
      output: {
        ...config_output,
        format: "cjs",
        file: "dist/jFactory-devel.cjs.js",
        sourcemap: SOURCEMAP
      },
      plugins: plugins_dev
    },

    { // dev umd
      ...config,
      output: {
        ...config_output,
        format: "umd",
        name: "jFactoryModule",
        file: "dist/jFactory-devel.umd.js",
        sourcemap: SOURCEMAP
      },
      plugins: plugins_dev
    },

    { // dev mjs
      ...config,
      output: {
        ...config_output,
        format: "es",
        file: "dist/jFactory-devel.mjs",
        sourcemap: SOURCEMAP
      },
      plugins: plugins_dev
    }

  )
}