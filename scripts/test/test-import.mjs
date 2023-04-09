import './polyfill-fetch.js'
const fs = require('fs');

let lib;
global.JFACTORY_ENV_LOG = false;
switch (process.env.MODE) {
    case "SOURCE":
        global.JFACTORY_ENV_DEV = true;
        lib = "../../src";
        break;
    case "ES_PROD":
        lib = "../../es";
        break;
    case "ES_DEVEL":
        lib = "../../es/devel";
        break;
    case "UMD_PROD":
        lib = "./umd/jFactory.js";
        break;
    case "UMD_DEVEL":
        lib = "./umd/jFactory-devel.js";
        break;
    default:
        throw "scripts/test/test-import.mjs : invalid process.env.MODE"
}
console.log('Testing ' + process.env.MODE + " " + lib);

if (process.env.MODE === "UMD_DEVEL" || process.env.MODE === "UMD_PROD") {
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