const packageJson = require('../../package.json');
const replace = require('../lib/utils.cjs').replace;
const stringify = require('../lib/utils.cjs').stringify;
const replacePlugin = require('@rollup/plugin-replace');
const MagicString = require('magic-string');
const path = require('path');
const fs = require('fs');

const project = {
  prodName: 'jFactory',
  develName: 'jFactory-devel',
  author: packageJson.author,
  version: packageJson.version,
  repository: packageJson.repository.url,
  homepage: packageJson.homepage,
  copyrightYear: packageJson['x-copyrightYear'],
  license: packageJson['x-licenseUrl'],
  buildId: new Date().getTime()
};

function injectOutputFormat() {
  return {
    name: 'inject-output-format',
    renderChunk(code, chunk, outputOptions) {
      const outputPath = `"${outputOptions.format}"`;
      const regex = /env\("JFACTORY_ENV_MOD"\)/g; // Regex to find the specific string
      const magicString = new MagicString(code);
      let match;
      while ((match = regex.exec(code)) !== null) {
        magicString.overwrite(match.index, match.index + match[0].length, outputPath);
      }
      return {
        code: magicString.toString(),
        map: magicString.generateMap({ hires: true })
      };
    }
  }
}

const commonOptions = function(devel = false) {
  return {
    treeshake: {
      preset: 'recommended'
      // moduleSideEffects: []
    },
    external: [
      'jquery',
      'lodash/isString.js',
      'lodash/isNumber.js',
      'lodash/isPlainObject.js',
      'lodash/defaultsDeep.js',
      'lodash/lowerFirst.js',
      'lodash/get.js',
      'lodash/template.js',
      'lodash/camelCase.js'
    ],
    plugins: [
      injectOutputFormat(),
      replacePlugin({
        delimiters: ['', ''],
        preventAssignment: true,
        // sourcemap: true, // may be required to preserve sourcemaps
        values: devel ? computedValuesDevel : computedValuesProd
      })
    ]
  }
}

const commonOutput = {
  generatedCode: {
    preset: 'es2015',
    arrowFunctions: true,
    constBindings: true,
    objectShorthand: true
  },
  // interop: 'auto',
  // exports: 'named',
  globals: function(name) {
    if (name === 'jquery') {
      return '$'
    } else {
      if (name.indexOf('lodash/') === 0) {
        return '_.' + path.parse(name).name
      }
    }
  }
}

const commonOutputUMD = function(devel = false) {
  return {
    format: 'umd',
    dir: 'dist/umd',
    name: 'jFactoryModule',
    entryFileNames: project[devel ? 'develName' : 'prodName'] + '.umd.js',
    banner: devel ?  bannerDevel : bannerProd,
    ...commonOutput
  }
}

const commonOutputCJS = function(devel = false) {
  return {
    format: 'cjs',
    entryFileNames: '[name].cjs',
    // !! modules must be preserved to allow module Tree Shaking in application bundler
    preserveModules: true,
    preserveModulesRoot: 'src',
    dir: devel ? 'dist/cjs-devel' : 'dist/cjs',
    banner: function(chunk) {
      return chunk.fileName === 'index.cjs' ? devel ? bannerDevel : bannerProd : '';
    },
    ...commonOutput
  }
}

const commonOutputES = function(devel = false) {
  return {
    format: 'es',
    entryFileNames: '[name].mjs',
    // !! modules must be preserved to allow module Tree Shaking in application bundler
    preserveModules: true,
    preserveModulesRoot: 'src',
    dir: devel ? 'dist/es-devel' : 'dist/es',
    banner: function(chunk) {
      return chunk.fileName === 'index.mjs' ? devel ? bannerDevel : bannerProd : '';
    },
    ...commonOutput
  }
}

const DEVELOPMENT = true;
const PRODUCTION = false;

const computedValuesProd  = getComputedValues(PRODUCTION);
const computedValuesDevel = getComputedValues(DEVELOPMENT);
const banner = fs.readFileSync('./src/tpl/banner.txt', 'utf8');
const bannerProd = replace(banner, computedValuesProd);
const bannerDevel = replace(banner, computedValuesDevel);

module.exports = {
  PRODUCTION,
  DEVELOPMENT,
  commonOptions,
  commonOutputUMD,
  commonOutputCJS,
  commonOutputES,
  bannerProd
};

function getComputedValues(devel = false) {
  return {
    ...stringify({
      'env("JFACTORY_ENV_NAME")': devel ? project.develName : project.prodName,
      'env("JFACTORY_ENV_VER")': project.version + '+build.' + project.buildId,
      'env("JFACTORY_ENV_DEV")': devel
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
    $JFACTORY_BUILD_ID: project.buildId
  }
}