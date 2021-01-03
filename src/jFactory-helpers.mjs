/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

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

export const helper_Deferred = () => new Deferred;

function Deferred(){
    this._done = [];
    this._fail = [];
}
Deferred.prototype = {
    execute: function(list, args){
        for (let h of list){
            h(...args)
        }
        this.fulfilled = true
    },
    resolve: function(){
        this.execute(this._done, arguments);
    },
    reject: function(){
        this.execute(this._fail, arguments);
    },

    done: function(callback){
        if (this.fulfilled) {
            callback()
        } else {
            this._done.push(callback);
        }
    },
    fail: function(callback){
        this._fail.push(callback);
    }
}