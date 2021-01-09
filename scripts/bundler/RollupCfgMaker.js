const { terser } = require("rollup-plugin-terser");
const replace = require("@rollup/plugin-replace");
const banner_b = require("fs").readFileSync(__dirname + "/dist-banner-b.txt", "utf8");
const banner_s = require("fs").readFileSync(__dirname + "/dist-banner-s.txt", "utf8");

module.exports = class RollupCfgMaker {
  constructor({
    filename = "???", version = "???", repo = "???", license = "???",
    bundle = true, debug = false,
    sourcemap = true // true for .map or "inline";
  }) {
    this.BUNDLE = bundle;
    this.DEBUG = debug;
    this.SOURCEMAP = sourcemap;
    this.FILENAME = filename;
    this.VERSION = version;
    this.LICENSE = license;
    this.REPO = repo;
  }

  dev(ext) {return this.config(true, ext)}
  prod(ext) {return this.config(false, ext)}

  loader() {
    return {
      input: __dirname + "/dist-index.js",
      output: {
        format: "cjs",
        file: "dist/index.js",
        interop: false,
        banner: banner_b
      },
      plugins: [
        replace({
          delimiters: ["", ""],
          JFACTORY_$FILENAME: this.FILENAME,
          JFACTORY_$VER: this.VERSION,
          JFACTORY_$REPO: this.REPO,
          JFACTORY_$LICENSE: this.LICENSE
        })
      ]
    }
  }

  get() {
    if (this.BUNDLE) {
      return [
        this.loader(),
        // this.prod("cjs"),
        this.prod("umd"),
        this.prod("mjs"),
        // this.dev("cjs"),
        this.dev("umd"),
        this.dev("mjs")
      ]
    } else {
      return [ this.dev("cjs") ]
    }
  }

  config(devel, format) {

    const version = `${this.VERSION}${devel ? "-devel" : ""}-${this.BUNDLE ? format : "raw"}`;

    const output = {
      format: format === "mjs" ? "es" : format,
      sourcemap: (devel || this.DEBUG) && this.SOURCEMAP,
      globals: {
        lodash: "_",
        jquery: "$"
      },
      interop: false,
      banner: banner_b
    };
    if (this.BUNDLE) {
      output.file = "dist/" + this.FILENAME +
        (devel ? "-devel" : "") +
        "." + format + ".js"
    } else {
      output.file = "dist/index.js"
    }
    if (format === "umd") {
      output.name = "jFactoryModule"
    }

    let plugin_replace = {
      delimiters: ["", ""],
      "(custom build)": version,
      'env("JFACTORY_ENV_DEV")': devel,
      'env("JFACTORY_ENV_DEBUG")': this.DEBUG,
      "// #JFACTORY_IF NPM": "", // alternative: https://github.com/aMarCruz/rollup-plugin-jscc
      JFACTORY_$FILENAME: this.FILENAME,
      JFACTORY_$VER: this.VERSION,
      JFACTORY_$REPO: this.REPO,
      JFACTORY_$LICENSE: this.LICENSE,
      [banner_s]: "" // remove copyright banner from source
    };

    let plugin_terser = {
      output: {
        beautify: this.DEBUG,
        comments: this.DEBUG ? true : "some"
      },
      keep_classnames: this.DEBUG,
      keep_fnames: this.DEBUG,
      mangle: !this.DEBUG,
      toplevel: !this.DEBUG,
      compress: !this.DEBUG && {
        ecma: 2020,
        drop_console: false,
        drop_debugger: !this.DEBUG
      }
    };
    if (devel || this.DEBUG) {
      Object.assign(plugin_terser, {
        keep_classnames: true,
        keep_fnames: true
      })
    }

    let plugins = [
      replace(plugin_replace)
    ];
    if (!devel || this.DEBUG) {
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
    }
  }
}