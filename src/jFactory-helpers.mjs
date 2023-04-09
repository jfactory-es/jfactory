/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Helpers
 * -----------------------------------------------------------------------------------------------------------------
 * Centralize helpers and externals in one module
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

// --------------
// jQuery
// --------------

export { default as jQuery } from 'jquery';

// --------------
// Lodash
// --------------

// Individual importation improves the tree shaking
// This is supposed to be equivalent to babel-plugin-lodash
// Please update the bundler config to avoid warning
export { default as helper_camelCase } from 'lodash/camelCase.js';
export { default as helper_get } from 'lodash/get.js';
export { default as helper_lowerFirst } from 'lodash/lowerFirst.js';
export { default as helper_template } from 'lodash/template.js';
export { default as helper_isString } from 'lodash/isString.js';
export { default as helper_isNumber } from 'lodash/isNumber.js';
export { default as helper_isPlainObject } from 'lodash/isPlainObject.js';
export { default as helper_defaultsDeep } from 'lodash/defaultsDeep.js';

// --------------
// Helpers
// --------------

export const NOOP = () => {};
export const helper_setFunctionName = (name, f) => Object.defineProperty(f, "name", { value: name });
const helper_url_abs_a = /*#__PURE__*/document.createElement("a");
export const helper_url_abs = url => { helper_url_abs_a.href = url; return helper_url_abs_a.href }

export const helper_isNative = function(f) {
    return typeof f === "function" && Function.prototype.toString.call(f).indexOf("[native code]") !== -1
}

export function helper_useragent(id) {
    return globalThis.navigator &&
    globalThis.navigator.userAgent &&
    globalThis.navigator.userAgent.indexOf(id + "/") > 0
}

export const helper_deferred = () => new Deferred;
class Deferred {
    constructor() {
        this._done = [];
        this._fail = [];
    }
    execute(list) {
        for (let h of list){
            h()
        }
        this.fulfilled = true
    }
    resolve() {
        this.execute(this._done);
    }
    reject() {
        this.execute(this._fail);
    }
    done(callback) {
        if (this.fulfilled) {
            callback()
        } else {
            this._done.push(callback);
        }
    }
    fail(callback) {
        if (this.fulfilled) {
            callback()
        } else {
            this._fail.push(callback);
        }
    }
}