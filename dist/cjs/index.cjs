/*!
 * jFactory v1.8.0-alpha.2+build.1730675680538
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2024 Stephane Plazis <sp.jfactory@gmail.com>
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.md
 */
'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const JFactoryAbout = require('./lib/JFactoryAbout.cjs');
const JFactoryComponents = require('./lib/JFactoryComponents.cjs');
const JFactoryError = require('./lib/JFactoryError.cjs');
const JFactoryEvents = require('./lib/JFactoryEvents.cjs');
const JFactoryExpect = require('./lib/JFactoryExpect.cjs');
const JFactoryFetch = require('./lib/JFactoryFetch.cjs');
const JFactoryFunction = require('./lib/JFactoryFunction.cjs');
const JFactoryLogger = require('./lib/JFactoryLogger.cjs');
const JFactoryObject = require('./lib/JFactoryObject.cjs');
const JFactoryPromise = require('./lib/JFactoryPromise.cjs');
const JFactoryTime = require('./lib/JFactoryTime.cjs');
const JFactoryTrace = require('./lib/JFactoryTrace.cjs');
const JFactoryTraits = require('./lib/JFactoryTraits.cjs');
const jFactoryEnv = require('./jFactory-env.cjs');
const jFactoryConfig = require('./jFactory-config.cjs');
const jFactoryHelpers = require('./jFactory-helpers.cjs');
const jFactory = require('./jFactory.cjs');
const jFactoryBootstrap = require('./jFactory-bootstrap.cjs');
const jQuery = require('jquery');
const helper_template = require('lodash/template.js');
const helper_isString = require('lodash/isString.js');
const helper_isNumber = require('lodash/isNumber.js');
const helper_isPlainObject = require('lodash/isPlainObject.js');
const helper_defaultsDeep = require('lodash/defaultsDeep.js');

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory entry file (see package.json scripts to compile)
 * -----------------------------------------------------------------------------------------------------------------
 * The ES version is exported as separated modules to benefit from module Tree Shaking
 * -----------------------------------------------------------------------------------------------------------------
 */

jFactoryBootstrap.jFactoryBootstrap();

exports.JFactoryAbout = JFactoryAbout.JFactoryAbout;
exports.JFactoryComponent = JFactoryComponents.JFactoryComponent;
exports.JFactoryCoreObject = JFactoryComponents.JFactoryCoreObject;
exports.JFACTORY_ERR_INVALID_CALL = JFactoryError.JFACTORY_ERR_INVALID_CALL;
exports.JFACTORY_ERR_INVALID_VALUE = JFactoryError.JFACTORY_ERR_INVALID_VALUE;
exports.JFACTORY_ERR_KEY_DUPLICATED = JFactoryError.JFACTORY_ERR_KEY_DUPLICATED;
exports.JFACTORY_ERR_KEY_MISSING = JFactoryError.JFACTORY_ERR_KEY_MISSING;
exports.JFACTORY_ERR_PROMISE_EXPIRED = JFactoryError.JFACTORY_ERR_PROMISE_EXPIRED;
exports.JFACTORY_ERR_REQUEST_ERROR = JFactoryError.JFACTORY_ERR_REQUEST_ERROR;
exports.JFactoryError = JFactoryError.JFactoryError;
exports.JFactoryEventSelector = JFactoryEvents.JFactoryEventSelector;
exports.JFactoryEventSelectorParser = JFactoryEvents.JFactoryEventSelectorParser;
exports.JFactoryEvents = JFactoryEvents.JFactoryEvents;
exports.JFactoryEventsManager = JFactoryEvents.JFactoryEventsManager;
exports.JFactoryExpect = JFactoryExpect.JFactoryExpect;
exports.JFactoryFetch = JFactoryFetch.JFactoryFetch;
exports.JFactoryFunctionComposer = JFactoryFunction.JFactoryFunctionComposer;
exports.JFactoryFunctionConditional = JFactoryFunction.JFactoryFunctionConditional;
exports.JFactoryFunctionExpirable = JFactoryFunction.JFactoryFunctionExpirable;
exports.JFactoryFunctionWrappable = JFactoryFunction.JFactoryFunctionWrappable;
exports.jFactoryFunctionConditional = JFactoryFunction.jFactoryFunctionConditional;
exports.jFactoryFunctionExpirable = JFactoryFunction.jFactoryFunctionExpirable;
exports.jFactoryFunctionWrappable = JFactoryFunction.jFactoryFunctionWrappable;
exports.JFactoryLogger = JFactoryLogger.JFactoryLogger;
exports.JFactoryObject = JFactoryObject.JFactoryObject;
exports.JFactoryPromise = JFactoryPromise.JFactoryPromise;
exports.JFactoryPromiseChain = JFactoryPromise.JFactoryPromiseChain;
exports.JFactoryPromisePath = JFactoryPromise.JFactoryPromisePath;
exports.JFactoryPromiseSync = JFactoryPromise.JFactoryPromiseSync;
exports.JFactoryTime = JFactoryTime.JFactoryTime;
exports.JFactoryTimeTrace = JFactoryTime.JFactoryTimeTrace;
exports.JFactoryTrace = JFactoryTrace.JFactoryTrace;
exports.JFactoryTrace_LIB_STACKTRACE = JFactoryTrace.JFactoryTrace_LIB_STACKTRACE;
exports.jFactoryTrace = JFactoryTrace.jFactoryTrace;
exports.JFactoryTraits = JFactoryTraits.JFactoryTraits;
exports.JFACTORY_BOOT = jFactoryEnv.JFACTORY_BOOT;
exports.JFACTORY_CLI = jFactoryEnv.JFACTORY_CLI;
exports.JFACTORY_DEV = jFactoryEnv.JFACTORY_DEV;
exports.JFACTORY_LOG = jFactoryEnv.JFACTORY_LOG;
exports.JFACTORY_MOD = jFactoryEnv.JFACTORY_MOD;
exports.JFACTORY_NAME = jFactoryEnv.JFACTORY_NAME;
exports.JFACTORY_REPL = jFactoryEnv.JFACTORY_REPL;
exports.JFACTORY_TRACE = jFactoryEnv.JFACTORY_TRACE;
exports.JFACTORY_VER = jFactoryEnv.JFACTORY_VER;
exports.jFactoryCfg = jFactoryConfig.jFactoryCfg;
exports.NOOP = jFactoryHelpers.NOOP;
exports.helper_camelCase = jFactoryHelpers.helper_camelCase;
exports.helper_deferred = jFactoryHelpers.helper_deferred;
exports.helper_get = jFactoryHelpers.helper_get;
exports.helper_isNative = jFactoryHelpers.helper_isNative;
exports.helper_lowerFirst = jFactoryHelpers.helper_lowerFirst;
exports.helper_setFunctionName = jFactoryHelpers.helper_setFunctionName;
exports.helper_url_abs = jFactoryHelpers.helper_url_abs;
exports.helper_useragent = jFactoryHelpers.helper_useragent;
exports.jFactory = jFactory.jFactory;
exports.jFactoryBootstrap = jFactoryBootstrap.jFactoryBootstrap;
exports.jQuery = jQuery;
exports.helper_template = helper_template;
exports.helper_isString = helper_isString;
exports.helper_isNumber = helper_isNumber;
exports.helper_isPlainObject = helper_isPlainObject;
exports.helper_defaultsDeep = helper_defaultsDeep;
