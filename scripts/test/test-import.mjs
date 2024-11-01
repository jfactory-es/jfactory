global.JFACTORY_ENV_LOG = false;

if (![
  'SOURCE',
  'ES_PROD',
  'ES_DEVEL',
  'CJS_PROD',
  'CJS_DEVEL',
  'UMD_PROD',
  'UMD_DEVEL'
].includes(process.env.JFACTORY_ENV)) {
  console.warn('Test should be run with a valid process.env.JFACTORY_ENV');
  process.env.JFACTORY_ENV = 'SOURCE';
}

let src;
switch (process.env.JFACTORY_ENV) {
  case 'SOURCE':
    global.JFACTORY_ENV_DEV = true;
    src = '../../src';
    break;
  case 'ES_PROD':
    src = '../../dist/es/index.mjs';
    break;
  case 'ES_DEVEL':
    src = '../../dist/es-devel/index.mjs';
    break;
  case 'CJS_PROD':
    src = '../../dist/cjs/index.cjs';
    break;
  case 'CJS_DEVEL':
    src = '../../dist/cjs-devel/index.cjs';
    break;
  case 'UMD_PROD':
    src = './dist/umd/jFactory.umd.js';
    break;
  case 'UMD_DEVEL':
    src = './dist/umd/jFactory-devel.umd.js';
    break;
}

export const wait = (t, value) => new Promise(resolve => {setTimeout(() => resolve(value), t)});

export const jFactoryModule = await import(src);
const { setPromiseAdapter } = require('../../test/promises-aplus-fork/lib/programmaticRunner');
setPromiseAdapter(jFactoryModule.JFactoryPromise);

export { default as jQuery } from 'jquery';
export { specify } from './polyfill-specify.js';
export { describe, it, expect, assert, afterEach, beforeEach } from 'vitest';

require('process').on('unhandledRejection', err => { console.debug('unhandledRejection', err) });