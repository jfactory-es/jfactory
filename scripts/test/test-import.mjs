import './polyfill-fetch.js'
global.JFACTORY_ENV_LOG = false;

let lib;
if (process.env.AUTO) {
    lib = "../../dist/index.js";
    console.log('Testing PROD BUNDLE '+lib);
}
if (process.env.PROD_BUNDLE) {
    lib = "../../dist/es";
    console.log('Testing PROD BUNDLE '+lib);
}
else if (process.env.DEV_BUNDLE) {
    lib = "../../dist/es/devel";
    console.log('Testing DEV BUNDLE '+lib);
}
else {
    lib = "../../src/index.mjs";
    console.log('Testing RAW files '+lib);
}

lib = await import(lib);
module.exports = {...lib}

export { specify } from "./polyfill-specify.js";
const { setPromiseAdapter } = require("../../test/promises-aplus-fork/lib/programmaticRunner");
setPromiseAdapter(lib.JFactoryPromise);

export function wait(t, value) {return new Promise(resolve => setTimeout(() => resolve(value), t))}
export { describe, it, expect, assert, afterEach, beforeEach } from 'vitest';
