export { default as jQuery } from 'jquery';
export { default as helper_template } from 'lodash/template.js';
export { default as helper_isString } from 'lodash/isString.js';
export { default as helper_isNumber } from 'lodash/isNumber.js';
export { default as helper_isPlainObject } from 'lodash/isPlainObject.js';
export { default as helper_defaultsDeep } from 'lodash/defaultsDeep.js';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Helpers
 * -----------------------------------------------------------------------------------------------------------------
 * Centralize helpers and externals in one module
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */


const helper_lowerFirst = str => str ? str[0].toLowerCase() + str.slice(1) : "";

function helper_get(object, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], object);
}

function helper_camelCase(str) {
    return str
        .toLowerCase()                       // Met tout en minuscules
        .replace(/[^a-zA-Z0-9]+(.)/g,
            (match, chr) => chr.toUpperCase());
}

// import i_helper_camelCase from "lodash/camelCase.js";
// import i_helper_get from "lodash/get.js";
// import i_helper_lowerFirst from "lodash/lowerFirst.js";
// import i_helper_template from "lodash/template.js";
// import i_helper_isString from "lodash/isString.js";
// import i_helper_isNumber from "lodash/isNumber.js";
// import i_helper_isPlainObject from "lodash/isPlainObject.js";
// import i_helper_defaultsDeep from "lodash/defaultsDeep.js";
//
// const helper_camelCase = i_helper_camelCase
// const helper_get = i_helper_get
// const helper_lowerFirst = i_helper_lowerFirst
// const helper_template = i_helper_template
// const helper_isString = i_helper_isString
// const helper_isNumber = i_helper_isNumber
// const helper_isPlainObject = i_helper_isPlainObject
// const helper_defaultsDeep = i_helper_defaultsDeep
//
// export {
//     helper_camelCase,
//     helper_get,
//     helper_lowerFirst,
//     helper_template,
//     helper_isString,
//     helper_isNumber,
//     helper_isPlainObject,
//     helper_defaultsDeep
// }

// --------------
// Helpers
// --------------

const NOOP = () => {};
const helper_setFunctionName = (name, f) => Object.defineProperty(f, "name", { value: name });
const helper_url_base = typeof window !== "undefined" && window.location ? window.location.href : "http://localhost";
const helper_url_abs = url => new URL(url, helper_url_base).href;

const helper_isNative = function(f) {
    return typeof f === "function" && Function.prototype.toString.call(f).indexOf("[native code]") !== -1
};

function helper_useragent(id) {
    return globalThis.navigator &&
    globalThis.navigator.userAgent &&
    globalThis.navigator.userAgent.indexOf(id + "/") > 0
}

const helper_deferred = () => new Deferred;
class Deferred {
    constructor() {
        this._done = [];
        this._fail = [];
    }
    execute(list) {
        for (let h of list){
            h();
        }
        this.fulfilled = true;
    }
    resolve() {
        this.execute(this._done);
    }
    reject() {
        this.execute(this._fail);
    }
    done(callback) {
        if (this.fulfilled) {
            callback();
        } else {
            this._done.push(callback);
        }
    }
    fail(callback) {
        if (this.fulfilled) {
            callback();
        } else {
            this._fail.push(callback);
        }
    }
}

export { NOOP, helper_camelCase, helper_deferred, helper_get, helper_isNative, helper_lowerFirst, helper_setFunctionName, helper_url_abs, helper_useragent };
