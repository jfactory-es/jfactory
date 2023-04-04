/*!
 * jFactory-devel v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import './jFactory-env.mjs';
import { jFactoryCompat_run } from './jFactory-compat.mjs';

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Helpers
// ---------------------------------------------------------------------------------------------------------------------
// Centralize helpers and externals in one module
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

// -------------------------------------
// Imports jquery from global or package
// -------------------------------------

const $ = globalThis.$ || (typeof require !=="undefined" && require('jquery'));

// -------------------------------------
// Imports lodash from global or package
// -------------------------------------

// Individual importation improves the tree shaking
// This is supposed to be equivalent to babel-plugin-lodash
const _ = globalThis._ || {
    isString : require('lodash/isString'),
    isNumber : require('lodash/isNumber'),
    isPlainObject : require('lodash/isPlainObject'),
    defaultsDeep : require('lodash/defaultsDeep'),
    lowerFirst : require('lodash/lowerFirst'),
    get : require('lodash/get'),
    template : require('lodash/template'),
    camelCase : require('lodash/camelCase'),
};

{
    jFactoryCompat_run([
        {
            name: "lodash",
            test: () => _,
            strict: true,
            info: "http://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md"
        },
        {
            name: "jquery",
            test: () => $,
            strict: true,
            info: "http://github.com/jfactory-es/jfactory/blob/master/docs/ref-import.md"
        }
    ]);
}

const jQuery = $;

const helper_isString = _.isString;
const helper_isNumber = _.isNumber;
const helper_isPlainObject = _.isPlainObject;
const helper_defaultsDeep = _.defaultsDeep;
const helper_lowerFirst = _.lowerFirst;
const helper_get = _.get;
const helper_template = _.template;
const helper_camelCase = _.camelCase;

const NOOP = () => {};
const helper_setFunctionName = (name, f) => Object.defineProperty(f, "name", { value: name });
const helper_url_abs_a = /*#__PURE__*/document.createElement("a");
const helper_url_abs = url => { helper_url_abs_a.href = url; return helper_url_abs_a.href };

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

export { NOOP, helper_camelCase, helper_defaultsDeep, helper_deferred, helper_get, helper_isNative, helper_isNumber, helper_isPlainObject, helper_isString, helper_lowerFirst, helper_setFunctionName, helper_template, helper_url_abs, helper_useragent, jQuery };
//# sourceMappingURL=jFactory-helpers.mjs.map
