/* jFactory, Copyright (c) 2019-2021, Stéphane Plazis, https://github.com/jfactory-es/jfactory */

import _ from "lodash";
import $ from "jquery";

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Helpers
// ---------------------------------------------------------------------------------------------------------------------
// Centralize helpers and externals in one module
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export const jQuery = $;

export const helper_isString = _.isString;
export const helper_isNumber = _.isNumber;
export const helper_isPlainObject = _.isPlainObject;
export const helper_defaultsDeep = _.defaultsDeep;
export const helper_lowerFirst = _.lowerFirst;
export const helper_get = _.get;
export const helper_template = _.template;
export const helper_camelCase = _.camelCase;

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