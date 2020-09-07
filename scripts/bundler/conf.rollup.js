// -------------------------------
// Bundle configuration (/dist)
// -------------------------------

const { getEnv } = require("../env");
const { terser } = require("rollup-plugin-terser");
const replace = require("@rollup/plugin-replace");
const pkg = require("../../package.json");

const DEBUG = getEnv("DEBUG") === true; // true: beautify output, more logs, allows debugger keyword
const BUNDLE = getEnv("BUNDLE") === true;
const VERSION = "v" + pkg.version;

module.exports = [];

const config = {
  input: "src/index.mjs",
  external: ["lodash", "jquery"],
  treeshake: {
    // see https://rollupjs.org/guide/en/#treeshake
    annotations: true, // allows  @__PURE__ or #__PURE__
    moduleSideEffects: false, // unused module never has side-effects. Can be a list or function
    propertyReadSideEffects: false, // reading a property of an object never has side-effect
    tryCatchDeoptimization: false, // allows optimization inside try catch
    unknownGlobalSideEffects: false // reading an unknown global never has side-effect
  }
};

const config_output = {
  globals: {
    lodash: "_",
    jquery: "$"
  },
  interop: false,
  banner: require("fs")
    .readFileSync("src/jFactory-header.mjs", "utf8")
    .replace("COMPILER_VER", VERSION)
};

const config_replace = {
  COMPILER_VER: VERSION,
  COMPILER_DEBUG: DEBUG,
  COMPILER_CLI: undefined
};

const config_terser = {
  toplevel: true,
  output: {
    beautify: DEBUG,
    comments: DEBUG ? true : "some"
  },
  keep_classnames: DEBUG,
  keep_fnames: DEBUG,
  mangle: !DEBUG,
  compress: {
    ecma: 8,
    drop_console: false,
    drop_debugger: !DEBUG
  }
};

if (!BUNDLE) { // simplified build for development

  module.exports.push({
    ...config,
    output: {
      ...config_output,
      file: pkg.main,
      format: "cjs",
      sourcemap: "inline"
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
    terser(config_terser)
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
        sourcemap: DEBUG ? "inline" : false
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
        sourcemap: DEBUG ? "inline" : false
      },
      plugins: plugins_prod
    },

    { // prod mjs
      ...config,
      output: {
        ...config_output,
        format: "es",
        file: "dist/jFactory.mjs",
        sourcemap: DEBUG ? "inline" : false
      },
      plugins: plugins_prod
    },

    { // dev cjs
      ...config,
      output: {
        ...config_output,
        format: "cjs",
        file: "dist/jFactory-devel.cjs.js",
        sourcemap: "inline"
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
        sourcemap: "inline"
      },
      plugins: plugins_dev
    },

    { // dev mjs
      ...config,
      output: {
        ...config_output,
        format: "es",
        file: "dist/jFactory-devel.mjs",
        sourcemap: "inline"
      },
      plugins: plugins_dev
    }

  )
}