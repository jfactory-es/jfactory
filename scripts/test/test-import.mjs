import './polyfill-fetch.js'
const fs = require('fs');

let lib;
global.JFACTORY_ENV_LOG = false;

if (![
    "SOURCE",
    "ES_PROD",
    "ES_DEVEL",
    "UMD_PROD",
    "UMD_DEVEL"
].includes(process.env.JFT_MODE)) {
    console.warn(`Test should be run with a valid process.env.JFT_MODE (given: "${process.env.JFT_MODE}")`);
    process.env.JFT_MODE = "ES_DEVEL"
}

switch (process.env.JFT_MODE) {
    case "SOURCE":
        global.JFACTORY_ENV_DEV = true;
        lib = "../../src";
        break;
    case "ES_PROD":
        lib = "../../dist/es";
        break;
    case "ES_DEVEL":
        lib = "../../dist/es-devel";
        break;
    case "UMD_PROD":
        lib = "./dist/umd/jFactory.umd.js";
        break;
    case "UMD_DEVEL":
        lib = "./dist/umd/jFactory-devel.umd.js";
        break;
}
console.log('Testing ' + process.env.JFT_MODE + " " + lib);

if (process.env.JFT_MODE === "UMD_DEVEL" || process.env.JFT_MODE === "UMD_PROD") {
    global._ = require('lodash');
    global.$ = require('jquery');
    // The umd header detects require() and import everything as node modules.
    // Removing this behavior to test external global imports (web mode)
    let source = fs.readFileSync(lib, {encoding:'utf8'});
    eval(source.replace('typeof exports', 'typeof exports_disabled'))
    if (!global.jFactoryModule) {
        throw new Error('Failed to import the UMD module as a global')
    }
    module.exports = global.jFactoryModule
} else {
    lib = await import(lib);
    module.exports = lib
}

export { specify } from "./polyfill-specify.js";
const { setPromiseAdapter } = require("../../test/promises-aplus-fork/lib/programmaticRunner");
setPromiseAdapter(lib.JFactoryPromise);

export function wait(t, value) {return new Promise(resolve => setTimeout(() => resolve(value), t))}
export { describe, it, expect, assert, afterEach, beforeEach } from 'vitest';