/*!
 * jFactory-devel v1.8.0-alpha.2 2024-11-03
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2024 Stephane Plazis <sp.jfactory@gmail.com>
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.md
 */
export { JFactoryAbout } from './lib/JFactoryAbout.mjs';
export { JFactoryComponent, JFactoryCoreObject } from './lib/JFactoryComponents.mjs';
export { JFACTORY_ERR_INVALID_CALL, JFACTORY_ERR_INVALID_VALUE, JFACTORY_ERR_KEY_DUPLICATED, JFACTORY_ERR_KEY_MISSING, JFACTORY_ERR_PROMISE_EXPIRED, JFACTORY_ERR_REQUEST_ERROR, JFactoryError } from './lib/JFactoryError.mjs';
export { JFactoryEventSelector, JFactoryEventSelectorParser, JFactoryEvents, JFactoryEventsManager } from './lib/JFactoryEvents.mjs';
export { JFactoryExpect } from './lib/JFactoryExpect.mjs';
export { JFactoryFetch } from './lib/JFactoryFetch.mjs';
export { JFactoryFunctionComposer, JFactoryFunctionConditional, JFactoryFunctionExpirable, JFactoryFunctionWrappable, jFactoryFunctionConditional, jFactoryFunctionExpirable, jFactoryFunctionWrappable } from './lib/JFactoryFunction.mjs';
export { JFactoryLogger } from './lib/JFactoryLogger.mjs';
export { JFactoryObject } from './lib/JFactoryObject.mjs';
export { JFactoryPromise, JFactoryPromiseChain, JFactoryPromisePath, JFactoryPromiseSync } from './lib/JFactoryPromise.mjs';
export { JFactoryTime, JFactoryTimeTrace } from './lib/JFactoryTime.mjs';
export { JFactoryTrace, JFactoryTrace_LIB_STACKTRACE, jFactoryTrace } from './lib/JFactoryTrace.mjs';
export { JFactoryTraits } from './lib/JFactoryTraits.mjs';
export { JFACTORY_BOOT, JFACTORY_CLI, JFACTORY_DEV, JFACTORY_LOG, JFACTORY_MOD, JFACTORY_NAME, JFACTORY_REPL, JFACTORY_TRACE, JFACTORY_VER } from './jFactory-env.mjs';
export { jFactoryCfg } from './jFactory-config.mjs';
export { NOOP, helper_camelCase, helper_deferred, helper_get, helper_isNative, helper_lowerFirst, helper_setFunctionName, helper_url_abs, helper_useragent } from './jFactory-helpers.mjs';
export { jFactory } from './jFactory.mjs';
import { jFactoryBootstrap } from './jFactory-bootstrap.mjs';
export { default as jQuery } from 'jquery';
export { default as helper_template } from 'lodash/template.js';
export { default as helper_isString } from 'lodash/isString.js';
export { default as helper_isNumber } from 'lodash/isNumber.js';
export { default as helper_isPlainObject } from 'lodash/isPlainObject.js';
export { default as helper_defaultsDeep } from 'lodash/defaultsDeep.js';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory entry file (see package.json scripts to compile)
 * -----------------------------------------------------------------------------------------------------------------
 * The ES version is exported as separated modules to benefit from module Tree Shaking
 * -----------------------------------------------------------------------------------------------------------------
 */

jFactoryBootstrap();

export { jFactoryBootstrap };
