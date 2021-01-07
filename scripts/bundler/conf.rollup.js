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

const SOURCEMAP = true; // *.map
// const SOURCEMAP = "inline";

const banner_b = fs.readFileSync("scripts/bundler/dist-banner-b.txt", "utf8");
const banner_s = fs.readFileSync("scripts/bundler/dist-banner-s.txt", "utf8");

module.exports = [];

function mkConfig(devmode, format) {

  const version = `${VERSION}${devmode ? "-devel" : ""}-${BUNDLE ? format : "raw"}`;

  const output = {
    format: format === "mjs" ? "es" : format,
    sourcemap: (devmode || DEBUG) && SOURCEMAP,
    globals: {
      lodash: "_",
      jquery: "$"
    },
    interop: false,
    banner: banner_b.replace("JFACTORY_VER", version)
  };
  if (BUNDLE) {
    output.file = "dist/jFactory" +
      (devmode ? "-devel" : "") +
      "." + format + ".js"
  } else {
    output.file = pkg.main
  }
  if (format === "umd") {
    output.name = "jFactoryModule"
  }

  let plugin_replace = {
    delimiters: ["", ""],
    "(custom build)": version,
    'env("JFACTORY_ENV_DEV")': devmode,
    'env("JFACTORY_ENV_DEBUG")': DEBUG,
    "const _ = globalThis._": 'import _ from "lodash"',
    "const $ = globalThis.$": 'import $ from "jquery"',
    [banner_s]: ""
  };

  let plugin_terser = {
    output: {
      beautify: DEBUG,
      comments: DEBUG ? true : "some"
    },
    keep_classnames: DEBUG,
    keep_fnames: DEBUG,
    mangle: !DEBUG,
    toplevel: !DEBUG,
    compress: !DEBUG && {
      ecma: 2020,
      drop_console: false,
      drop_debugger: !DEBUG
    }
  };
  if (devmode || DEBUG) {
    Object.assign(plugin_terser, {
      keep_classnames: true,
      keep_fnames: true
    })
  }

  let plugins = [
    replace(plugin_replace)
  ];
  if (!devmode || DEBUG) {
    plugins.push(terser(plugin_terser))
  }

  return {
    input: "src/index.mjs",
    external: ["lodash", "jquery"],
    treeshake: {
      // see https://rollupjs.org/guide/en/#treeshake
      annotations: true, // allows  @__PURE__ or #__PURE__
      moduleSideEffects: false, // unused module never has side-effects. Can be a list or function
      unknownGlobalSideEffects: false, // reading an unknown global never has side-effect
      propertyReadSideEffects: false, // reading a property of an object has side-effect
      tryCatchDeoptimization: false // disable optimization inside try catch
    },
    output,
    plugins
  };
}

function mkConfig_PROD(ext) {return mkConfig(false, ext)}
function mkConfig_DEV(ext) {return mkConfig(true, ext)}

if (BUNDLE) {
  module.exports.push(
    { // loader
      input: "scripts/bundler/dist-index.js",
      output: {
        format: "cjs",
        file: pkg.main,
        interop: false,
        banner: banner_b.replace("JFACTORY_VER", VERSION)
      }
    },
    mkConfig_PROD("cjs"),
    mkConfig_PROD("umd"),
    mkConfig_PROD("mjs"),
    mkConfig_DEV("cjs"),
    mkConfig_DEV("umd"),
    mkConfig_DEV("mjs")
  )
} else {
  module.exports.push(mkConfig_DEV("cjs"));
}