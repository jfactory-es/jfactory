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

export const helper_isNative = _.isNative;
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
export const helper_url_abs = url => {helper_url_abs.a.href = url; return helper_url_abs.a.href};
helper_url_abs.a = document.createElement("a");