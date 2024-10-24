const fs = require("fs");
const packageJson = require("../../package.json");
const terserPlugin = require("@rollup/plugin-terser");
const replacePlugin = require("@rollup/plugin-replace");

const project = {
  prodName : "jFactory",
  develName: "jFactory-devel",
  author: packageJson.author,
  version: packageJson.version,
  repository: packageJson.repository.url,
  homepage: packageJson.homepage,
  copyrightYear: packageJson['x-copyrightYear'],
  license: packageJson['x-licenseUrl'],
  buildId: new Date().toISOString().slice(0, 10)
};

function getComputedValues(devel = false) {
  return {
    ...stringify({
      'env("JFACTORY_ENV_NAME")': devel ? project.develName : project.prodName,
      'env("JFACTORY_ENV_VER")': project.version,
      'env("JFACTORY_ENV_DEV")': devel,
    }),
    $JFACTORY_NAME: devel ? project.develName : project.prodName,
    $JFACTORY_PROD_NAME: project.prodName,
    $JFACTORY_DEVEL_NAME: project.develName,
    $JFACTORY_VER: project.version,
    $JFACTORY_AUTHOR: project.author,
    $JFACTORY_REPOSITORY: project.repository,
    $JFACTORY_HOMEPAGE: project.homepage,
    $JFACTORY_COPYRIGHT_YEAR: project.copyrightYear,
    $JFACTORY_LICENSE: project.license,
    $JFACTORY_BUILD_ID: project.buildId,
  }
}

let banner = fs.readFileSync("./src/tpl/banner.txt", "utf8");

const path = require('path');
const commonOutput = {
  generatedCode: {
    preset: 'es2015',
    arrowFunctions: true,
    constBindings: true,
    objectShorthand: true,
  },
  exports: 'named',
  globals : function(name) {
    if (name === "jquery") {
      return "$"
    } else {
      if (name.indexOf('lodash/')===0) {
        return '_.'+path.parse(name).name
      }
    }
  }
}

module.exports = {

  input({ devel = false, input = 'src/index.mjs' }) {
    return {
      input,
      treeshake: {
        moduleSideEffects : [
        ]
      },
      plugins: [
        replacePlugin({
          delimiters: ["", ""],
          preventAssignment: true,
          values: getComputedValues(devel)
        })
      ],
      external : [
        "jquery",
        "lodash/isString.js",
        "lodash/isNumber.js",
        "lodash/isPlainObject.js",
        "lodash/defaultsDeep.js",
        "lodash/lowerFirst.js",
        "lodash/get.js",
        "lodash/template.js",
        "lodash/camelCase.js",
      ]
    }
  },

  outputProd() {
    // const terserOptions= {
    // };
    return [
      {
        format: 'umd',
        entryFileNames: project.prodName + ".umd.js",
        name: "jFactoryModule",
        banner: replace(banner, getComputedValues(false)),
        plugins: [
          terserPlugin(/*terserOptions*/)
        ],
        dir: 'dist/umd',
        ...commonOutput
      },
      {
        format: 'es',
        entryFileNames: "[name].mjs",
        banner: function(chunk) {
          return chunk.fileName === "index.mjs" ? replace(banner, getComputedValues(false)) : "";
        },
        // !! modules must be preserved to allow module Tree Shaking in application bundler
        preserveModules: true,
        preserveModulesRoot: 'src',
        plugins: [
          // terserPlugin(terserOptions)
        ],
        dir: 'dist/es',
        ...commonOutput
      }
    ]
  },

  outputDevel() {
    return [
      {
        format: 'umd',
        entryFileNames: project.develName + ".umd.js",
        name: "jFactoryModule",
        banner: replace(banner, getComputedValues(true)),
        // sourcemap: true,
        dir: 'dist/umd',
        plugins: [
          // terserPlugin(terserOptions)
        ],
        ...commonOutput
      },
      {
        format: 'es',
        entryFileNames: "[name].mjs",
        // sourcemap: true,
        banner: function(chunk) {
          return chunk.fileName === "index.mjs" ? replace(banner, getComputedValues(true)) : "";
        },
        // !! modules must be preserved to allow module Tree Shaking in application bundler
        preserveModules: true,
        preserveModulesRoot: 'src',
        plugins: [
          // terserPlugin(terserOptions)
        ],
        dir: 'dist/es-devel',
        ...commonOutput
      }
    ]
  },

  outputIndex() {
    return [
      {
        format: 'cjs',
        entryFileNames: "index.js",
        banner: replace(banner, getComputedValues(false)),
        dir: 'dist',
      }
    ]
  },

  outputTestApp() {
    return [
      {
        format: 'es',
        entryFileNames: "[name].mjs",
        // helps to check which modules are exported
        preserveModules: true,
        dir: 'test/app',
      }
    ]
  }
}

function stringify(replaceValues){
  return Object.entries(replaceValues).reduce((acc, [key, value]) => {
    acc[key] = JSON.stringify(value);
    return acc;
  }, {})
}

function replace(str, match) {
  for (const [search, replace] of Object.entries(match)) {
    let s = str.split(search);
    if (s.length > 1) {
      str = s.join(replace)
    }
  }
  return str
}