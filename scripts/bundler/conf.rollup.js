// -------------------------------
// Bundle configuration (/dist)
// -------------------------------

const { getEnv } = require("../env");
const pkg = require("../../package.json");
const { terser } = require("rollup-plugin-terser");
const replace = require("rollup-plugin-replace");

const BUNDLE = getEnv("BUNDLE") === true;
const DEBUG = getEnv("DEBUG") === true; // true: more logs, beautify /dist output, force debugger & logs

module.exports = [];

let common = {
  external: ["lodash", "jquery"],
  treeshake: {
    annotations: true,
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
    unknownGlobalSideEffects: false
  }
};

let common_output = {
  globals: {
    lodash: "_",
    jquery: "$"
  }
};

if (!BUNDLE) { // simplified build for development

  module.exports.push({
    input: "src/index.mjs",
    output: {
      format: "cjs",
      file: pkg.main,
      interop: false,
      sourcemap: "inline",
      ...common_output
    },
    ...common,
    plugins: [
      replace({
        COMPILER_DEV: true,
        COMPILER_DEBUG: DEBUG,
        COMPILER_CLI: undefined
      })
    ]
  })

} else { // full "dist" build

  // Note: terser "module" option
  // is automatically set by the plugin

  const plugins_dev = [
    replace({
      COMPILER_DEV: true,
      COMPILER_DEBUG: DEBUG,
      COMPILER_CLI: undefined
    }),

    terser({
      toplevel: true,
      output: {
        beautify: DEBUG
      },
      keep_classnames: DEBUG,
      keep_fnames: DEBUG,
      mangle: !DEBUG,
      compress: {
        ecma: 8,
        drop_console: false,
        drop_debugger: !DEBUG
      }
    })
  ];

  const plugins_prod = [
    replace({
      COMPILER_DEV: false,
      COMPILER_DEBUG: DEBUG,
      COMPILER_CLI: undefined
    }),

    terser({
      toplevel: true,
      output: {
        beautify: DEBUG
      },
      keep_classnames: DEBUG,
      keep_fnames: DEBUG,
      mangle: !DEBUG,
      compress: {
        ecma: 8,
        drop_console: false,
        drop_debugger: !DEBUG
      }
    })
  ];

  module.exports.push(

    // node env switch

    {
      input: "scripts/bundler/dist-index.js",
      output: {
        format: "cjs",
        file: pkg.main,
        interop: false
      }
    },

    // production

    {
      input: "src/index.mjs",
      output: {
        format: "cjs",
        file: "dist/jFactory.cjs.js",
        interop: false,
        sourcemap: DEBUG ? "inline" : false,
        ...common_output
      },
      ...common,
      plugins: plugins_prod
    },

    {
      input: "src/index.mjs",
      output: {
        format: "umd",
        name: "jFactoryModule",
        file: "dist/jFactory.umd.js",
        interop: false,
        sourcemap: DEBUG ? "inline" : false,
        ...common_output
      },
      ...common,
      plugins: plugins_prod
    },

    {
      input: "src/index.mjs",
      output: {
        format: "es",
        file: "dist/jFactory.mjs",
        interop: false,
        sourcemap: DEBUG ? "inline" : false,
        ...common_output
      },
      ...common,
      plugins: plugins_prod

    },

    // development

    {
      input: "src/index.mjs",
      output: {
        format: "cjs",
        file: "dist/jFactory-devel.cjs.js",
        interop: false,
        sourcemap: true,
        ...common_output
      },
      ...common,
      plugins: plugins_dev
    },

    {
      input: "src/index.mjs",
      output: {
        format: "umd",
        name: "jFactoryModule",
        file: "dist/jFactory-devel.umd.js",
        interop: false,
        sourcemap: true,
        ...common_output
      },
      ...common,
      plugins: plugins_dev
    },

    {
      input: "src/index.mjs",
      output: {
        format: "es",
        file: "dist/jFactory-devel.mjs",
        interop: false,
        sourcemap: true,
        ...common_output
      },
      ...common,
      plugins: plugins_dev
    }
  );
}