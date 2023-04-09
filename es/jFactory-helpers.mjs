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
// Helpers
// --------------

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

export { NOOP, helper_deferred, helper_isNative, helper_setFunctionName, helper_url_abs, helper_useragent };
