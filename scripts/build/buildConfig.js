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
  copyrightYear: checkCopyrightYear(packageJson['x-copyrightYear']),
  license: packageJson['x-licenseUrl'],
  buildId: new Date().toISOString().slice(0, 10)
};

function getReplaceValues(devel = false) {
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

let banner = fs.readFileSync("./scripts/build/dist-banner-b.txt", "utf8");

const commonOutput = {
  generatedCode : "es2015",
  interop: "esModule",
  exports: 'named',
  dir: 'dist',
}

module.exports = {

  input({ devel = false, input = 'src/index.mjs' }) {
    return {
      input,
      plugins: [
        replacePlugin({
          delimiters: ["", ""],
          preventAssignment: true,
          values: getReplaceValues(devel)
        })
      ],
      external : [
        'lodash',
        'jquery',
      ]
    }
  },

  outputProd() {
    const terserOptions= {
      mangle: {
        // Fix a mysterious bug in nodejs v18.15.0
        // Node probably tries to detect "exports." in the umd module
        // otherwise import() returns the module in a "default" property
        reserved: ['exports']
      },
      output: {
        comments: 'some',
      }
    };
    return [
      {
        format: 'umd',
        entryFileNames: project.prodName + ".umd.js",
        name: "jFactoryModule",
        banner: replace(banner, getReplaceValues(false)),
        plugins: [
          terserPlugin(terserOptions)
        ],
        ...commonOutput
      },
      {
        format: 'es',
        entryFileNames: project.prodName + ".mjs",
        banner: replace(banner, getReplaceValues(false)),
        plugins: [
          terserPlugin(terserOptions)
        ],
        ...commonOutput
      }
    ]
  },

  outputDevel() {
    // const terserOptions= {
    //   compress : false,
    //   keep_classnames: true,
    //   keep_fnames: true,
    //   mangle: false,
    //   output: {
    //     beautify: true,
    //     comments: 'all'
    //   }
    // };
    return [
      {
        format: 'umd',
        entryFileNames: project.develName + ".umd.js",
        name: "jFactoryModule",
        banner: replace(banner, getReplaceValues(true)),
        sourcemap: true,
        plugins: [
          // terserPlugin(terserOptions)
        ],
        ...commonOutput
      },
      {
        format: 'es',
        entryFileNames: project.develName + ".mjs",
        banner: replace(banner, getReplaceValues(true)),
        sourcemap: true,
        plugins: [
          // terserPlugin(terserOptions)
        ],
        ...commonOutput
      }
    ]
  },

  outputIndex() {
    return [
      {
        format: 'cjs',
        entryFileNames: "index.js",
        banner: replace(banner, getReplaceValues(false)),
        dir: 'dist',
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

function checkCopyrightYear(copyrightYear) {
  if (copyrightYear.split('-')[1] !== new Date().getFullYear().toString()) {
    console.error("Please check or update property x-copyrightYear in package.json", copyrightYear.split('-')[1]);
    process.exit(1)
  }
  return copyrightYear
}