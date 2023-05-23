/*!
 * jFactory-devel v1.8.0-alpha 2023-05-23
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/get.js'), require('lodash/lowerFirst.js'), require('lodash/template.js'), require('lodash/isString.js'), require('lodash/isNumber.js'), require('lodash/isPlainObject.js'), require('lodash/camelCase.js'), require('lodash/defaultsDeep.js'), require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash/get.js', 'lodash/lowerFirst.js', 'lodash/template.js', 'lodash/isString.js', 'lodash/isNumber.js', 'lodash/isPlainObject.js', 'lodash/camelCase.js', 'lodash/defaultsDeep.js', 'jquery'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jFactoryModule = {}, global._.get, global._.lowerFirst, global._.template, global._.isString, global._.isNumber, global._.isPlainObject, global._.camelCase, global._.defaultsDeep, global.$));
})(this, (function (exports, helper_get, helper_lowerFirst, helper_template, helper_isString, helper_isNumber, helper_isPlainObject, helper_camelCase, helper_defaultsDeep, jQuery) { 'use strict';

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory Env
     * -----------------------------------------------------------------------------------------------------------------
     * Contextualize jFactory for bundle, raw source or partial export usage
     * -----------------------------------------------------------------------------------------------------------------
     * JFACTORY_ENV_* are optional globals that allow contextualization at startup.
     * Bundler can replace some 'env("JFACTORY_ENV_*")' with hard-coded primitives to improve tree shaking
     * See https://github.com/jfactory-es/jfactory/blob/master/docs/ref-overriding.md
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    const JFACTORY_NAME  =  "jFactory-devel" ;
    const JFACTORY_VER   =  "1.8.0-alpha" ;

    const JFACTORY_CLI   = /*#__PURE__*/ env("JFACTORY_ENV_CLI") ?? /*#__PURE__*/ isNode();
    const JFACTORY_REPL  = /*#__PURE__*/ env("JFACTORY_ENV_REPL") ?? /*#__PURE__*/ isPlayground();
    const JFACTORY_DEV   =  true ; // Developer Mode
    const JFACTORY_LOG   = /*#__PURE__*/ env("JFACTORY_ENV_LOG") ?? JFACTORY_DEV;
    const JFACTORY_TRACE = /*#__PURE__*/ env("JFACTORY_ENV_TRACE") ?? JFACTORY_DEV;
    const JFACTORY_BOOT  = /*#__PURE__*/ env("JFACTORY_ENV_BOOT") ?? true; // Boot jFactory at load

    function env(key) {
        return globalThis[key]
    }

    function isNode() {
        return (
            typeof process === "object" &&
            typeof process.versions === "object" &&
            process.versions.node
        )
    }

    function isPlayground() {
        const hosts = [
            "cdpn.io",
            "fiddle.jshell.net",
            "null.jsbin.com",
            "jsitor.com",
            "jseditor.io",
            "liveweave.com",
            "run.plnkr.co",
            "playcode.io"
        ];
        try {
            return hosts.indexOf(new URL(document.location.href).hostname) !== -1
        } catch {}
    }

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

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory Config
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    const JFACTORY_CFG = {};
    function jFactoryCfg(key, config) {
        if (config !== undefined) {
            {
                if (typeof config != "object" || config === null) {
                    throw "argument config given to jFactoryCfg(key, config) must be an object"
                }
            }
            JFACTORY_CFG[key] = config;
        }
        return JFACTORY_CFG[key] ??= {}
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory Compat
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    const JFACTORY_COMPAT_fetch = {
        name: "fetch",
        test: () => fetch,
        info: "https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch"
    };
    const JFACTORY_COMPAT_Request = {
        name: "Request",
        test: () => Request,
        info: "https://developer.mozilla.org/docs/Web/API/Request"
    };
    const JFACTORY_COMPAT_AbortController = {
        name: "AbortController/AbortSignal",
        test: () => new AbortController().signal,
        info: "https://developer.mozilla.org/docs/Web/API/AbortController, " +
            "https://developer.mozilla.org/docs/Web/API/AbortSignal"
    };
    const JFACTORY_COMPAT_MutationObserver = {
        name: "MutationObserver",
        test: () => MutationObserver,
        info: "https://developer.mozilla.org/docs/Web/API/MutationObserver"
    };

    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    let deferred = {};

    function jFactoryCompat_require(...args) {
        for (let compat of args) {
            deferred[compat.name] = compat;
        }
    }

    function jFactoryCompat_run(entries = deferred) {
        for (let entry of Object.values(entries)) {
            let pass;
            try {pass = Boolean(entry.test());} catch (ignore) {}
            if (!pass) {
                let msg = `jFactory may require the support of "${entry.name}", ${entry.info}`;
                entry.message && (msg += "\n" + entry.message);
                if (entry.strict) {
                    throw new Error(msg)
                } else {
                    console.warn(msg);
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory Bootstrap
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    let isLoaded = false;
    let seq = [];

    function jFactoryBootstrap(auto) {
        if (!isLoaded) {
            if (auto && !JFACTORY_BOOT) {
                // auto bootstrap is disabled by env
                return
            }
            {
                console.log(`${JFACTORY_NAME} ${JFACTORY_VER} running in development mode; performances may be affected`);
                !JFACTORY_LOG && console.log("jFactory: logs disabled");
                jFactoryCompat_run();
            }
            init();
            isLoaded = true;
        }
    }

    function init() {
        if (seq) {
            for (let handler of seq) {
                handler();
            }
            seq = null;
        }
    }

    function jFactoryBootstrap_onBoot(handler) {
        if (isLoaded) {
            throw new Error("trying to set handler for jFactoryBootstrap() but already called:\n"
                + handler.toString())
        }
        seq.push(handler);
    }

    function jFactoryBootstrap_expected() {
        if (!isLoaded) {
            throw new Error("jFactoryBootstrap() must be called before using jFactory")
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryTrace
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta, HasSideEffects
     * -----------------------------------------------------------------------------------------------------------------
     * - #limitation# Error.stack is not standardized
     * - #limitation# Error.stack is not source-mapped
     * - #limitation# bug https://bugzilla.mozilla.org/show_bug.cgi?id=1584244
     * - #limitation# StackTrace.js resolves sourcemaps. Unfortunately, it doesn't work with "webpack:" protocol
     *   see https://github.com/stacktracejs/stacktrace.js/issues/209
     * -----------------------------------------------------------------------------------------------------------------
     * https://github.com/mozilla/source-map/
     * https://www.stacktracejs.com/
     * https://github.com/novocaine/sourcemapped-stacktrace
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryTrace {

        constructor(omitAboveFunctionName = "JFactoryTrace", omitSelf = true, stackTraceLimit = Infinity) {
            let _stackTraceLimit;
            if (stackTraceLimit) {
                _stackTraceLimit = Error.stackTraceLimit;
                Error.stackTraceLimit = stackTraceLimit;
            }

            this.source = new Error();
            this.omitAboveFunctionName = omitAboveFunctionName;
            this.omitSelf = omitSelf;

            if (stackTraceLimit) {
                Error.stackTraceLimit = _stackTraceLimit;
            }

            this.init();
        }

        init() {
            this.printable = this.source;
            this.asyncPrintable = Promise.resolve(this.printable);
        }

        static createErrorFromStack(stack) {
            let e = new Error();
            e.name = "JFactoryTrace";
            e.stack = stack;
            return e
        }
    }

    class JFactoryTrace_LIB_STACKTRACE extends JFactoryTrace {

        init() {
            let h = traceFrames => {
                this.printable = this.constructor.createErrorFromStack(
                    this.createStackFromTraceFrames(
                        this.filterTraceFrames(traceFrames)
                    )
                );
            };

            h(StackTrace.getSync(this.source, CONFIG$3.libOptions));
            if (CONFIG$3.useSourcemap) {
                this.asyncPrintable = StackTrace.fromError(this.source, CONFIG$3.libOptions).then(h);
            } else {
                this.asyncPrintable = Promise.resolve(this.printable);
            }
        }

        filterTraceFrames(traceFrames) {
            if (this.omitAboveFunctionName) {
                let slice = traceFrames.findIndex(
                    value => value.functionName && value.functionName.endsWith(this.omitAboveFunctionName)
                );
                if (slice > 0) {
                    if (this.omitSelf) {
                        slice++;
                    }
                    traceFrames = traceFrames.slice(slice);
                }
            }
            return traceFrames
        }

        createStackFromTraceFrames(traceFrames) {
            for (let formatter of Object.values(jFactoryTrace.formatters)) {
                if (formatter.test()) {
                    return formatter.format(traceFrames)
                }
            }
            return this.source.stack
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // jFactoryTrace
    // -----------------------------------------------------------------------------------------------------------------
    // Status: Beta
    // -----------------------------------------------------------------------------------------------------------------

    let tracer;
    if (JFACTORY_TRACE) {

        tracer = {

            captureTraceSource(omitAboveFunctionName, omitSelf, stackTraceLimit) {
                return new(CONFIG$3.tracer || JFactoryTrace)(omitAboveFunctionName, omitSelf, stackTraceLimit)
            },

            attachTrace(
                targetObject, traceSource /* or omitAboveFunctionName */,
                traceLogKey = CONFIG$3.keys[0], traceSourceKey = CONFIG$3.keys[1],
                label = CONFIG$3.label
            ) {
                if (typeof traceSource !== "object") {
                    traceSource = this.captureTraceSource(traceSource || "attachTrace", !traceSource);
                }

                let log = () => console.log(traceSource.printable) || label || "The stack has been printed in the console";

                Object.defineProperty(targetObject, traceLogKey, {
                    // hide the function body to improve readability in devtool
                    get: () => log()
                });

                Object.defineProperty(targetObject, traceSourceKey, {
                    value: traceSource
                });
            },

            formatters: {

                webkit: {
                    test() {
                        return helper_useragent("Chrome")
                    },
                    format(traceFrames) {
                        // Chrome syntax
                        // String must start with "Error" and parenthesis are important
                        // => The console will convert the uri using sourcemaps
                        return "Error (generated by JFactoryTrace)\n" +
                            traceFrames.map(sf => {
                                let s = "\tat ";
                                let uri = sf.fileName + ":" + sf.lineNumber + ":" + sf.columnNumber;
                                if (sf.functionName) {
                                    s += sf.functionName + " (" + uri + ")";
                                } else {
                                    s += uri; // no parenthesis
                                }
                                return s
                            }).join("\n");
                    }
                },

                firefox: {
                    test() {
                        return helper_useragent("Gecko")
                    },
                    format(traceFrames) {
                        // Firefox syntax
                        return traceFrames.map(sf =>
                            (sf.functionName ?? "<anonymous>")
                                + "@" + sf.fileName + ":" + sf.lineNumber + ":" + sf.columnNumber
                        ).join("\n");
                    }
                }
            }
        };

    } else {

        tracer = {
            captureTraceSource: NOOP,
            attachTrace: NOOP
        };

    }

    const jFactoryTrace = tracer;

    // -----------------------------------------------------------------------------------------------------------------
    // Config JFactoryTrace
    // -----------------------------------------------------------------------------------------------------------------

    const CONFIG$3 = /*#__PURE__*/jFactoryCfg("JFactoryTrace");

    if (JFACTORY_TRACE) {
        CONFIG$3.keys = ["$dev_traceLog", "$dev_traceSource"];
        if (typeof StackTrace === "object") {
            CONFIG$3.tracer = JFactoryTrace_LIB_STACKTRACE;
            CONFIG$3.useSourcemap = false;
        }
        jFactoryBootstrap_onBoot(function() {
            if (CONFIG$3.tracer === JFactoryTrace_LIB_STACKTRACE) {
                console.log("JFactoryTrace: Stacktrace.js support enabled; performances will be affected");
            }
        });
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryError
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryError extends Error {
        constructor(message = "unspecified error", data = null) {
            data = Object.assign(Object.create(null), data);
            message = JFactoryError.toPrintable(message, data);
            super(message);
            this.$data = Object.assign(Object.create(null), data);
        }

        toString() {
            return this.message
        }

        * [Symbol.iterator]() {
            yield this.message;
            yield this.$data;
        }

        static getId(object) {
            return object[CONFIG$2.keys.find(key => {
                let val = helper_get(object, key);
                return val || val === 0
            })]
        }

        static toPrintableData(data) {
            const templateData = {};
            let nv;
            for (let [key, val] of Object.entries(data)) {
                switch (typeof val) {
                    case "function":
                        val = val.name + "()";
                        break;
                    case "object":
                        if (val === null) {
                            val = "null";
                            break
                        }
                        if (val instanceof Error) {
                            val = val.toString();
                            break
                        }
                        if ((nv = JFactoryError.getId(val)) !== undefined) {
                            val = '"' + nv + '"';
                        } else {
                            if (!helper_isNative(val.toString)) {
                                val = val.toString();
                            } else {
                                try {
                                    nv = JSON.stringify(val);
                                    val = nv.length > CONFIG$2.jsonMax
                                        ? nv.substring(0, CONFIG$2.jsonMax) + "[...]" : nv;
                                } catch (e) {
                                    val = "[object " + val.constructor.name + "]";
                                }
                            }
                        }
                        break;
                    case "string":
                        val = '"' + val + '"';
                        break;
                    default:
                        val = String(val);
                }
                templateData[key] = val;
            }
            return templateData
        }

        static toPrintable(template, data) {
            const templateMessage = [];
            for (let part of template.split(";")) {
                let placeholder;
                let re = CONFIG$2.regPlaceholder;
                re.lastIndex = 0;
                if ((placeholder = re.exec(part))) {
                    do {
                        if (placeholder[1] && placeholder[1] in data) {
                            templateMessage.push(part.trim());
                            break
                        }
                    } while ((placeholder = re.exec(part)) !== null)
                } else {
                    templateMessage.push(part.trim());
                }
            }
            return helper_lowerFirst(helper_template(templateMessage.join("; "))(JFactoryError.toPrintableData(data)));
        }

        static factory(type, template) {
            let ret = {
                [type]: class extends JFactoryError {
                    constructor(data, traceSource) {
                        super(template, data);
                        jFactoryTrace.attachTrace(this.$data, traceSource);
                    }
                }
            }[type];

            // Chrome automatically resolves sourcemap when logging errors
            // but only if the error name starts with "Error"
            ret.prototype.name = "Error JFACTORY_ERR_" + type;
            return ret
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFACTORY_ERR_*
    // -----------------------------------------------------------------------------------------------------------------

    const E = JFactoryError.factory;

    /* eslint-disable max-len */
    const JFACTORY_ERR_INVALID_VALUE = /*#__PURE__*/E("INVALID_VALUE", "invalid value for ${target}; Reason: ${reason}; Given: ${given}");
    const JFACTORY_ERR_INVALID_CALL = /*#__PURE__*/E("INVALID_CALL", "invalid call ${target}; Reason: ${reason}; Owner: ${owner}");
    const JFACTORY_ERR_PROMISE_EXPIRED = /*#__PURE__*/E("PROMISE_EXPIRED", "expired promise ${target}; Reason: ${reason}");
    const JFACTORY_ERR_REQUEST_ERROR = /*#__PURE__*/E("REQUEST_ERROR", "error requesting ${target}; Reason: ${reason}; Owner: ${owner}");
    const JFACTORY_ERR_KEY_DUPLICATED = /*#__PURE__*/E("KEY_DUPLICATED", "duplicated key for ${target}; Given: ${given}");
    const JFACTORY_ERR_KEY_MISSING = /*#__PURE__*/E("KEY_MISSING", "missing key for ${target}; Given: ${given}");

    // -----------------------------------------------------------------------------------------------------------------
    // Config JFactoryError
    // -----------------------------------------------------------------------------------------------------------------

    const CONFIG$2 = /*#__PURE__*/jFactoryCfg("JFactoryError", {
        regPlaceholder: /\${([^}]+)}/g,
        jsonMax: 40,
        keys: ["$.about.name", "$dev_name", "$name", "name", "id"]
    });

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryExpect
     * -----------------------------------------------------------------------------------------------------------------
     * A small input/output validation tool
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta, HasSideEffects
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @return {*|JFactoryExpect}
     */
    function JFactoryExpect(label, value) {
        jFactoryBootstrap_expected();
        if (new.target) {
            this.label = label;
            this.value = value;
        } else {
            return new JFactoryExpect(label, value)
        }
    }

    const error = function jFactoryThrow(label, value, message) {
        throw new JFACTORY_ERR_INVALID_VALUE({
            target: label,
            reason: message,
            given: value
        })
    };

    const staticMethods = {
        /**
         * @method notUndefined
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method notUndefined
         * @memberOf JFactoryExpect
         */
        notUndefined(label, value) {
            if (value === undefined) {
                error(label, value, "cannot be undefined");
            }
            return true
        },

        /**
         * @method notEmptyString
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method notEmptyString
         * @memberOf JFactoryExpect
         */
        notEmptyString(label, value) {
            if (value === "") {
                error(label, value, "cannot be empty string");
            }
            return true
        },

        /**
         * @method notFalsy
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method notFalsy
         * @memberOf JFactoryExpect
         */
        notFalsy(label, value) {
            if (!value) {
                error(label, value, 'cannot be a falsy value (undefined, null, NaN, 0, "")');
            }
            return true
        },

        /**
         * @method validSpaces
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method validSpaces
         * @memberOf JFactoryExpect
         */
        validSpaces(label, value) {
            if (!value.replace || value.replace(/\s+/g, " ").trim() !== value) {
                error(label, value, "invalid space delimiters");
            }
            return true
        },

        /**
         * @method matchReg
         * @memberOf JFactoryExpect#
         * @param {RegExp} reg
         * @return JFactoryExpect
         */
        /**
         * @method matchReg
         * @memberOf JFactoryExpect
         */
        matchReg(label, value, reg) {
            if (!reg.test(value)) {
                error(label, value, 'string "' + value + '" must match ' + reg);
            }
            return true
        },

        /**
         * @method type
         * @memberOf JFactoryExpect#
         * @param {...*} expected
         * @return JFactoryExpect
         */
        /**
         * @method type
         * @memberOf JFactoryExpect
         */
        type(label, value, ...expected) {
            let name, ok = false;
            for (let constructor of expected) {
                if (constructor === null) {
                    name = "Null";
                } else if ("name" in constructor) {
                    name = constructor.name;
                }
                let test = staticMethods["type" + name];
                if (test) {
                    try {ok = test(label, value/*, e*/);} catch (e) {}
                } else {
                    ok = value instanceof constructor;
                }
                if (ok) break
            }
            if (!ok) {
                error(label, value, "must be an instance of [" + expected.map(e => e.name).join(", ") + "]");
            }
            return true
        },

        /**
         * @method typeNull
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method typeNull
         * @memberOf JFactoryExpect
         */
        typeNull(label, value) {
            if (value !== null) {
                error(label, value, "must be null");
            }
            return true
        },

        /**
         * @method typeBoolean
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method typeBoolean
         * @memberOf JFactoryExpect
         */
        typeBoolean(label, value) {
            if (value !== true && value !== false) {
                error(label, value, "must be a boolean");
            }
            return true
        },

        /**
         * @method typeString
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method typeString
         * @memberOf JFactoryExpect
         */
        typeString(label, value) {
            if (!helper_isString(value)) {
                error(label, value, "must be a string");
            }
            return true
        },

        /**
         * @method typeNumber
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method typeNumber
         * @memberOf JFactoryExpect
         */
        typeNumber(label, value) {
            if (!helper_isNumber(value)) {
                error(label, value, "must be a number");
            }
            return true
        },

        /**
         * @method typeFunction
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method typeFunction
         * @memberOf JFactoryExpect
         */
        typeFunction(label, value) {
            if (!(typeof value === "function")) {
                error(label, value, "must be a function");
            }
            return true
        },

        /**
         * @method typePlainObject
         * @memberOf JFactoryExpect#
         * @return JFactoryExpect
         */
        /**
         * @method typePlainObject
         * @memberOf JFactoryExpect
         */
        typePlainObject(label, value) {
            if (!helper_isPlainObject(value)) {
                error(label, value, "must be a plain object");
            }
            return true
        },

        /**
         * @method equal
         * @memberOf JFactoryExpect#
         * @param {*} expected
         * @return JFactoryExpect
         */
        /**
         * @method equal
         * @memberOf JFactoryExpect
         */
        equal(label, value, ...expected) {
            let ok = false;
            for (let e of expected) {
                if ((ok = value === e)) break
            }
            if (!ok) {
                error(label, value, "must be one of [" + expected + "]");
            }
            return true;
        },

        /**
         * @method equalIn
         * @memberOf JFactoryExpect#
         * @param {Array|Object} expected
         * @return JFactoryExpect
         */
        /**
         * @method equalIn
         * @memberOf JFactoryExpect
         */
        equalIn(label, value, expected) {
            if (!Array.isArray(expected)) {
                expected = Object.values(expected);
            }
            if (!expected.includes(value)) {
                error(label, value, "must be one from [" + expected.join(", ") + "]");
            }
            return true
        },

        /**
         * @method properties
         * @memberOf JFactoryExpect#
         * @param {Array} expected
         * @return JFactoryExpect
         */
        /**
         * @method properties
         * @memberOf JFactoryExpect
         */
        properties(label, value, expected) {
            for (let name of Object.getOwnPropertyNames(value)) {
                JFactoryExpect(label + ', property name "' + name + '"', name).equalIn(expected);
            }
            return true
        },

        /**
         * @method writable
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method writable
         * @memberOf JFactoryExpect
         */
        writable(label, value, key) {
            if (!Object.getOwnPropertyDescriptor(value, key).writable) {
                error(label, value, "must be writable");
            }
            return true
        },

        /**
         * @method notWritable
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method notWritable
         * @memberOf JFactoryExpect
         */
        notWritable(label, value, key) {
            if (Object.getOwnPropertyDescriptor(value, key).writable) {
                error(label, value, "must not be writable");
            }
            return true
        },

        /**
         * @method enumerable
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method enumerable
         * @memberOf JFactoryExpect
         */
        enumerable(label, value, key) {
            if (!Object.prototype.propertyIsEnumerable.call(value, key)) {
                error(label, value, "must be enumerable");
            }
            return true
        },

        /**
         * @method notEnumerable
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method notEnumerable
         * @memberOf JFactoryExpect
         */
        notEnumerable(label, value, key) {
            if (Object.prototype.propertyIsEnumerable.call(value, key)) {
                error(label, value, "must not be enumerable");
            }
            return true
        },

        /**
         * @method configurable
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method configurable
         * @memberOf JFactoryExpect
         */
        configurable(label, value, key) {
            if (!Object.getOwnPropertyDescriptor(value, key).configurable) {
                error(label, value, "must be configurable");
            }
            return true
        },

        /**
         * @method notConfigurable
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method notConfigurable
         * @memberOf JFactoryExpect
         */
        notConfigurable(label, value, key) {
            if (Object.getOwnPropertyDescriptor(value, key).configurable) {
                error(label, value, "must not be configurable");
            }
            return true
        },

        /**
         * @method reservedProperty
         * @memberOf JFactoryExpect#
         * @param {String} key
         * @return JFactoryExpect
         */
        /**
         * @method reservedProperty
         * @memberOf JFactoryExpect
         */
        reservedProperty(label, value, key) {
            if (key in value) {
                error(label, value, "is a reserved property");
            }
            return true
        }
    };

    jFactoryBootstrap_onBoot(function() {
        Object.assign(JFactoryExpect, staticMethods);
        // Generate members from static methods
        for (const name of Object.getOwnPropertyNames(staticMethods)) {
            JFactoryExpect.prototype[name] =
                function callStatic(...args) {
                    JFactoryExpect[name](this.label, this.value, ...args);
                    return this
                };
        }
    });

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryObject
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta, HasSideEffects
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryObject {

        static createDescriptors(descriptorPrototype = JFactoryObject.DESCRIPTORS_PROTOTYPE) {
            let create = JFactoryObject.create(descriptorPrototype, true, true);
            let o = Object.create(null);

            o.NONE = create();

            o.WRITABLE     = create({ writable: true });
            o.ENUMERABLE   = create({ enumerable: true });
            o.CONFIGURABLE = create({ configurable: true });

            o.CONFIGURABLE_WRITABLE   =
            o.WRITABLE_CONFIGURABLE   = create({ writable: true, configurable: true });

            o.CONFIGURABLE_ENUMERABLE =
            o.ENUMERABLE_CONFIGURABLE = create({ enumerable: true, configurable: true });

            o.ENUMERABLE_WRITABLE     =
            o.WRITABLE_ENUMERABLE     = create({ writable: true, enumerable: true });

            o.WRITABLE_ENUMERABLE_CONFIGURABLE =
            o.WRITABLE_CONFIGURABLE_ENUMERABLE =
            o.ENUMERABLE_CONFIGURABLE_WRITABLE =
            o.ENUMERABLE_WRITABLE_CONFIGURABLE =
            o.CONFIGURABLE_WRITABLE_ENUMERABLE =
            o.CONFIGURABLE_ENUMERABLE_WRITABLE = create({ writable: true, enumerable: true, configurable: true });

            // Shortcuts
            o.READONLY = create({ writable: false, enumerable: false, configurable: false });

            return o
        }

        /**
         * @example
         * assign(obj, 'myProperty', 123, {writable:false})
         * assign(obj, {a:1, b:2}', {writable:false})
         *
         * deprecated
         * assign(obj, 'myProperty', {value:"ok", writable:false}) => not strict
         * assign(obj, 'myProperty', 123) => use native instead
         * assign(obj, {a:1, b:2}) => use native instead
         */
        static assign(target, property, value, descriptor) {
            let descriptors = {};

            switch (typeof property) {

                case "string":
                case "symbol":

                    // ------------------------------------------------
                    // assign(obj, 'myProperty', 123, {writable:false})
                    // ------------------------------------------------

                    if (!descriptor) {
                        throw new Error("missing descriptor argument; use Object.assign instead")
                    }

                    descriptor = Object.create(descriptor); // avoid descriptor corruption
                    descriptor.value = value;

                    Object.defineProperty(target, property, descriptor);

                    break;

                case "object":

                    // ------------------------------------------------
                    // assign(obj, {a:1, b:2}', {writable:false})
                    // ------------------------------------------------

                    [value, descriptor] = [property, value];

                    if (!descriptor) {
                        throw new Error("missing descriptor argument; use Object.assign instead")
                    }

                    for (let name of Object.getOwnPropertyNames(value)) {
                        descriptors[name] = Object.create(descriptor); // avoid descriptor corruption
                        descriptors[name].value = value[name];
                    }
                    for (let name of Object.getOwnPropertySymbols(value)) {
                        descriptors[name] = Object.create(descriptor); // avoid descriptor corruption
                        descriptors[name].value = value[name];
                    }

                    Object.defineProperties(target, descriptors);

                    break;

                default:
                    throw new Error("invalid property argument")
            }

            return target
        }

        static create(prototype, flat = false, disinherit = false) {
            return function create(properties) {
                if (flat) {
                    return Object.assign(disinherit ? Object.create(null) : {}, prototype, properties)
                } else {
                    return Object.assign(Object.create(
                        disinherit ? Object.assign(Object.create(null), prototype) : prototype
                    ), properties)
                }
            }
        }

        static disinherit(object) {
            return Object.assign(Object.create(null), object);
        }
    }

    JFactoryObject.DESCRIPTORS_PROTOTYPE = { writable: false, enumerable: false, configurable: false };

    jFactoryBootstrap_onBoot(function() {
        JFactoryObject.descriptors = JFactoryObject.createDescriptors();
    });

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryAbout
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    const moduleGenId$1 = () => ++moduleGenId$1.uid; moduleGenId$1.uid = 0;

    class JFactoryAbout {
        constructor(owner, about = {}) {
            {
                JFactoryExpect("JFactoryAbout(owner)", owner).type(Object);
                JFactoryExpect("JFactoryAbout(about)", about)
                    .typePlainObject()
                    .reservedProperty("uid")
                    .reservedProperty("fingerprint");
                if ("name" in about) {
                    JFactoryExpect("JFactoryAbout(about.name)", about.name)
                        .typeString()
                        .notEmptyString();
                }
            }

            let name;
            let fingerprint;
            let uid = moduleGenId$1();

            if (about.name) {
                name = about.name;
                delete about.name;
                fingerprint = "jFactory" + "_" + helper_camelCase(name.toLowerCase()) + "_" + uid;
            } else {
                delete about.name;
                name = `[${owner.constructor.name}#${uid}]`;
                fingerprint = "jFactory" + "_" + owner.constructor.name + "_" + uid;
            }

            JFactoryObject.assign(this, /** @lends JFactoryAbout# */ {
                uid,
                name,
                fingerprint
            }, JFactoryObject.descriptors.ENUMERABLE);

            Object.assign(this, about);

            // ---

            {
                JFactoryExpect("JFactoryAbout.name", this.name)
                    .matchReg(/^[\w[\]#]+$/);
                JFactoryExpect("JFactoryAbout.fingerprint", this.fingerprint)
                    .matchReg(/^[\w]+$/);
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryTraits
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryTraits {
        /**
         * @param {JFactoryCoreObject|Object} callerInstance
         * @param {Class|Function} callerConstructor
         * @param options
         */
        constructor(callerInstance, callerConstructor, options = {}) {
            /**
             * @type {JFactoryCoreObject}
             */
            this.callerInstance = callerInstance;

            /**
             * @type {Class|Function}
             */
            this.callerConstructor = callerConstructor;

            /**
             * @type {Object}
             */
            this.options = options;
        }

        use(trait, ...traitArgs) {
            {
                JFactoryExpect("JFactoryTraits(trait)", trait).typeFunction();
            }

            // callerConstructor is not always the callerInstance.constructor:
            // The Trait can be injected in an inherited constructor from super() at call time
            let { callerInstance, callerConstructor } = this;

            // Detect improper duplication (can be a trait already called by a super class)
            let cache = JFactoryTraits.CACHE.get(callerInstance);

            if (cache) {
                if (cache.has(trait)) {
                    if (JFACTORY_LOG) {
                        console.warn(`${trait.name} already called on`, callerInstance);
                    }
                    return this;
                } else {
                    cache.add(trait);
                }
            } else {
                JFactoryTraits.CACHE.set(callerInstance, new WeakSet([trait]));
            }

            !callerConstructor.JFactoryTrait && (callerConstructor.JFactoryTrait = new WeakSet);

            if (!callerConstructor.JFactoryTrait.has(trait)) {
                callerConstructor.JFactoryTrait.add(trait);
                this.export(trait.prototype, callerConstructor.prototype);
                this.export(trait, callerConstructor, true);
            }

            // In a Trait.constructor(callerInstance, ...args) : this != callerInstance
            // In a Trait.trait_constructor(...args) : this == callerInstance (traits is injected and available)

            // Traits are injections. They are not dynamic inheritance.
            // So the Trait.constructor() doesn't share the "this" keyword with its caller.

            // #limitation# No way to bind an ES6 class constructor to an object
            // => Implementer can define a "trait_constructor()" that is automatically bound to "callerInstance"
            // and called after the native trait constructor().

            // eslint-disable-next-line new-cap
            let traitInstance = new trait(callerInstance, ...traitArgs);
            if (traitInstance.trait_constructor) {
                traitInstance.trait_constructor.apply(callerInstance, traitArgs);
            }
            return this
        }

        export(source, target, isStatic) {
            let sourceDescriptor = Object.getOwnPropertyDescriptors(source);

            for (let propertyName of Object.keys(sourceDescriptor)) {
                let prefix = JFactoryTraits.getPrefix(propertyName);

                if (JFactoryTraits.getTarget(propertyName, target, prefix)) {
                    let propertyDescriptor = sourceDescriptor[propertyName];
                    let parsed = (this.options.parser || JFactoryTraits.defaultParser)(
                        propertyName, propertyDescriptor, source, target, isStatic
                    );
                    if (parsed) {
                        ({ propertyName, propertyDescriptor } = parsed);
                        Object.defineProperty(target, propertyName, propertyDescriptor);
                    }
                }
            }
        }

        static defaultParser(propertyName, propertyDescriptor, source, target, isStatic) {
            let value = propertyDescriptor.value;

            if (isStatic) {return null} // don't export static members

            if (propertyName in target) { // skip existing properties
                if (JFACTORY_LOG) {
                    console.warn(
                        `${target.constructor.name}> skipping export of existing property "${propertyName}"`,
                        value);
                }
                return null
            }

            if (typeof value === "object") { // prevent shared object exportation
                if (JFACTORY_LOG) {
                    console.warn(
                        `${target.constructor.name}> skipping export of shared object "${propertyName}"`,
                        value);
                }
                return null;
            }

            return { propertyName, propertyDescriptor }
        }

        static getPrefix(key) {
            let split = key.split("_");
            return split.length > 1 ? split[0] : null;
        }

        static getTarget(key, target, prefix) {
            if (
                JFactoryTraits.EXCLUDES.includes(key) ||
                prefix === "trait"
            ) {
                return null
            }

            return target
        }
    }

    JFactoryTraits.CACHE = new WeakMap;
    JFactoryTraits.EXCLUDES = ["constructor", "prototype", "length", "size"];

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryFunction
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryFunctionComposer
    // -----------------------------------------------------------------------------------------------------------------

    class JFactoryFunctionComposer {

        constructor() {
            this.handlers = Object.create(null);
        }

        * [Symbol.iterator](handlerGroups = []) {

            if (!handlerGroups.length) {
                handlerGroups = Object.keys(this.handlers);
            }
            if (!handlerGroups.length) {
                handlerGroups = ["default"];
            }

            for (let handlerGroup of handlerGroups) {
                if (handlerGroup in this.handlers) {
                    yield* this.handlers[handlerGroup];
                }
            }
        }

        /** @return {JFactoryFunctionComposer} */
        first(handlerGroup, handler) {
            if (arguments.length === 1) {
                [handlerGroup, handler] = ["default", handlerGroup];
            }
            (this.handlers[handlerGroup] || (this.handlers[handlerGroup] = [])).unshift(handler);
            return this
        }

        /** @return {JFactoryFunctionComposer} */
        last(handlerGroup, handler) {
            if (arguments.length === 1) {
                [handlerGroup, handler] = ["default", handlerGroup];
            }
            (this.handlers[handlerGroup] || (this.handlers[handlerGroup] = [])).push(handler);
            return this
        }

        /** @return {(function(): *) & {composer: JFactoryFunctionComposer}} */
        compose(...handlerGroups) {
            let composer = this;
            let composite = function() {
                // !!!!--!!!!--!!!!--!!!!--!!!!--!!!!--!!!!--!!!! //
                //                                                //
                //                wrapped function                //
                //                                                //
                //    You should Blackbox JFactoryFunction.mjs    //
                //    to simplify debugging                       //
                //                                                //
                // !!!!--!!!!--!!!!--!!!!--!!!!--!!!!--!!!!--!!!! //
                let context = {
                    canceled: false,
                    parameters: Array.from(arguments),
                    result: undefined
                };
                let iterator = composer[Symbol.iterator](handlerGroups);
                let iteration = iterator.next();
                return JFactoryFunctionComposer.composite_iterator(
                    this /* preserve call scope */, context, iteration, iterator)
            };
            composite.composer = composer;
            return composite;
        }

        // SPEC: Composite functions returns promise *only* if at least
        // one handler returns a promise (async function or promise return)
        // So we cannot just iterate using an "await for of"
        static composite_iterator(scope, context, iteration, handlers) {
            let handler,
                result;

            while (!context.canceled && !iteration.done) {
                handler = iteration.value;
                if (scope) {
                    result = handler.call(scope, context, ...context.parameters);
                } else {
                    result = handler(context, ...context.parameters);
                }
                iteration = handlers.next(); // prepares next iteration to know if "done"
                if (result instanceof Promise) {
                    if (iteration.done
                        // case of last handler returning a promise
                        // #limitation# now way to detect if the promise is the returned value or an "await"
                        // (we don't want to change the value of context.result during a pending handler)
                        // => native Promise are always chained
                        && result.constructor !== Promise) {
                        context.result = result; // we can safely set the new result
                    } else {
                        return result.then(helper_setFunctionName(
                            [handler.name, "[compositeAsyncHandler]"].filter(Boolean).join(" "),
                            function(value) {
                                context.result = value;
                                return JFactoryFunctionComposer.composite_iterator(scope, context, iteration, handlers)
                            })
                        )
                    }
                } else {
                    context.result = result;
                }
            }
            return context.result
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryFunctionExpirable - Expirable Function Pattern
    // -----------------------------------------------------------------------------------------------------------------

    function jFactoryFunctionExpirable(originalHandler) {
        return new JFactoryFunctionExpirable(originalHandler).compose()
    }

    class JFactoryFunctionExpirable {

        constructor(originalHandler) {
            this.originalHandler = originalHandler;
            this.expiredCalls = 0;
            this.composer = new JFactoryFunctionComposer;

            let isExpired = this.composer.compose("conditions");
            let expirable = this;
            let expired;

            // cannot use a real accessor here (conditions can be scoped, so isExpired too)
            this.isExpired = scope => expired || isExpired.call(scope) || false;
            this.setExpired = value => expired = value ?
                value instanceof Error ? value : new JFACTORY_ERR_INVALID_CALL({
                    target: this.originalHandler,
                    reason: "manually expired"
                }) : Boolean(this.expiredCalls = 0);

            this.addExpireCondition = function(condition) {
                this.composer.last("conditions", function(context) {
                    let done = function(result) {
                        {
                            JFactoryExpect("JFactoryFunctionExpirable.addExpireCondition(), result", result)
                                .type(Boolean, Error);
                        }
                        return expirable.setExpired(result ?
                            (context.canceled = true) &&
                            (result instanceof Error ?
                                result :
                                new JFACTORY_ERR_INVALID_CALL({
                                    target: expirable.originalHandler,
                                    reason: "conditionally expired",
                                    condition
                                })
                            ) : false
                        )
                    };
                    let result = condition.apply(this, context.parameters);
                    return result instanceof Promise ? result.then(done) : done(result);
                });
            };
        }

        compose() {
            let expirable = this;
            let composite = function() {
                let isExpired = expirable.isExpired(this);
                let call = expirable.constructor.call.bind(undefined, expirable, this, arguments);
                return isExpired instanceof Promise ? isExpired.then(call) : call(isExpired);
            };
            return Object.assign(composite, {
                expirable: this,
                isExpired: f => this.isExpired(f),
                setExpired: f => this.setExpired(f),
                addExpireCondition: f => {this.addExpireCondition(f); return composite}
            });
        }

        static call(expirable, scope, args, isExpired) {
            return isExpired ? expirable.onExpired(isExpired) : expirable.onNotExpired(scope, args);
        }

        onExpired(expired) {
            if (this.expiredCalls < JFactoryFunctionExpirable.MaxWarningExpiration) {
                this.expiredCalls++;
                if (JFACTORY_LOG) {
                    console.warn(...new JFACTORY_ERR_INVALID_CALL({
                        ...expired.$data,
                        reason: expired.$data.reason
                            + "; expiredCalls="
                            + this.expiredCalls
                            + (this.expiredCalls === JFactoryFunctionExpirable.MaxWarningExpiration
                                ? "; Max Warning Exceeded" : "")
                    }));
                }
            }
            return expired
        }

        onNotExpired(scope, args) {
            return this.originalHandler.apply(scope, args)
        }
    }

    JFactoryFunctionExpirable.MaxWarningExpiration = 10;

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryFunctionConditional - Conditional Function Pattern
    // -----------------------------------------------------------------------------------------------------------------

    function jFactoryFunctionConditional(originalHandler) {
        return new JFactoryFunctionConditional(originalHandler).compose()
    }

    class JFactoryFunctionConditional {

        constructor(originalHandler) {
            this.originalHandler = originalHandler;
            this.composer = new JFactoryFunctionComposer;
            this.composer.first("original", helper_setFunctionName(
                [originalHandler.name, "[condition]"].filter(Boolean).join(" "),
                function(context) {
                    return originalHandler.apply(this, context.parameters);
                })
            );
        }

        compose() {
            let composite = this.composer.compose("conditions", "original");
            return Object.assign(composite, {
                conditional: this,
                addCondition: f => {this.addCondition(f); return composite}
            });
        }

        addCondition(condition) {
            this.composer.last("conditions", function(context) {
                let handle = function(result) {
                    {
                        JFactoryExpect("JFactoryFunctionConditional.addCondition(), result", result)
                            .typeBoolean();
                    }
                    !result && (context.canceled = true);
                };
                let result = condition.apply(this, context.parameters);
                return result instanceof Promise ? result.then(handle) : handle(result);
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryFunctionWrappable - Wrappable Function Pattern
    // -----------------------------------------------------------------------------------------------------------------

    function jFactoryFunctionWrappable(originalHandler) {
        return new JFactoryFunctionWrappable(originalHandler).compose()
    }

    class JFactoryFunctionWrappable {

        constructor(originalHandler) {
            this.originalHandler = originalHandler;
            this.composer = new JFactoryFunctionComposer;
            this.composer.first("original", helper_setFunctionName(
                [originalHandler.name, "[wrapped]"].filter(Boolean).join(" "),
                function(context) {
                    return originalHandler.apply(this, context.parameters);
                })
            );
        }

        compose() {
            let composite = this.composer.compose("before", "original", "after");
            return Object.assign(composite, {
                wrappable: this,
                beforeAll: f => {this.beforeAll(f); return composite},
                justBefore: f => {this.justBefore(f); return composite},
                justAfter: f => {this.justAfter(f); return composite},
                afterAll: f => {this.afterAll(f); return composite}
            });
        }

        beforeAll(handler) {
            this.composer.first("before", handler);
        }

        justBefore(handler) {
            this.composer.last("before", handler);
        }

        justAfter(handler) {
            this.composer.first("after", handler);
        }

        afterAll(handler) {
            this.composer.last("after", handler);
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory Traits
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    function jFactoryTraits(callerInstance, callerConstructor) {
        return new JFactoryTraits(callerInstance, callerConstructor, {

            parser(propertyName, propertyDescriptor/*, source, target, isStatic */) {
                let parsed = JFactoryTraits.defaultParser(...arguments);

                if (parsed) {
                    ({ propertyName, propertyDescriptor } = parsed);

                    let value = propertyDescriptor.value;
                    if (typeof value === "function") {
                        switch (value.name) {
                            case "$install":
                            case "$uninstall":
                            case "$enable":
                            case "$disable":
                            case "$state":
                                break;
                            default:
                                propertyDescriptor.value = jFactoryFunctionWrappable(value)
                                    .beforeAll(function() {
                                        if (!this.$.states.enabled && this.$.service.phase === "PHASE_NONE") {
                                            let e = new JFACTORY_ERR_INVALID_CALL({
                                                owner: this,
                                                target: value,
                                                reason: "component disabled"
                                            });
                                            this.$logErr(...e);
                                            throw e
                                        }
                                    });
                        }
                    }

                    return { propertyName, propertyDescriptor }
                }
            }
        })
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    const jFactory = function(name, properties) {
        return Object.assign(new (jFactoryCfg('jFactory').baseComponent)(name), properties);
    };

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryLogger
     * -----------------------------------------------------------------------------------------------------------------
     * A contextual logger that prepends a label and allows runtime filtering while preserving the caller line number
     * -----------------------------------------------------------------------------------------------------------------
     * logger.createSubLogger(label) create a sub-logger of logger; "logger" can be a sub-logger.
     * logger.disable() disable console for itself and sub-loggers
     * logger.disallow('log') disallow logger.log() only
     * logger.disallow('log', subLogger.label) disallow sub-logger.log() only. This is callable from any logger/sub-logger
     * -----------------------------------------------------------------------------------------------------------------
     * Status : Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    const SYMBOL_ENABLED = Symbol();

    class JFactoryLogger {

        constructor(options) {
            if (options) {
                JFactoryExpect("JFactoryLogger(options)", options)
                    .properties(Object.getOwnPropertyNames(JFactoryLogger.DEFAULT_CONFIG));
            }
            helper_defaultsDeep(this, options, CONFIG$1);
            this.installAccessor("log");
            this.installAccessor("warn");
            this.installAccessor("error");
        }

        get enabled() {
            return this[SYMBOL_ENABLED] && (this.parentLogger ? this.parentLogger.enabled : true)
        }

        set enabled(v) {
            v ? this.enable() : this.disable();
        }

        enable() {
            if (this[SYMBOL_ENABLED] !== true) {
                this[SYMBOL_ENABLED] = true;
            }
        }

        disable() {
            if (this[SYMBOL_ENABLED] !== false) {
                this[SYMBOL_ENABLED] = false;
            }
        }

        disallow(nativeName, label = this.label) {
            if (!this.filters[label]) {this.filters[label] = {};}
            this.filters[label][nativeName] = true;
        }

        allow(nativeName, label = this.label) {
            if (this.filters[label]) {
                delete this.filters[label][nativeName];
            }
        }

        installAccessor(nativeName, targetName = nativeName, target = this) {
            {
                JFactoryExpect("JFactoryLogger(nativeName)", nativeName).equalIn(["log", "warn", "error"]);
            }
            Object.defineProperties(target, {
                [targetName]: {
                    get: this.accessor.bind(this, nativeName/*, target*/),
                    configurable: true
                }
            });
        }

        accessor(nativeName/*, target*/) {
            if (!this[SYMBOL_ENABLED]) {
                return NOOP;
            }
            return this.condition(nativeName) && this.formatter[nativeName](this) || NOOP
        }

        createSubLogger(label) {
            /** @type JFactoryLogger */
            let sub = new JFactoryLogger({
                enabled: this.enabled,
                label: this.label + "." + label,
                styles_css: this.styles_css,
                styles_cli: this.styles_cli,
                console: this.console,
                formatter: this.formatter
            });
            sub.parentLogger = this;
            sub.condition.addCondition(() => this.enabled);
            sub.filters = this.filters; // shared to allow/disallow from anywhere
            return sub
        }
    }

    // #limitation# To preserve the line number, we can only use native functions, like bind
    // #limitation# Because we use bind(), only the style of the first element can be defined efficiently

    JFactoryLogger.FORMATTER_NATIVE = {
        log: logger => logger.console.log.bind(logger.console, logger.label + ">"),
        warn: logger => logger.console.warn.bind(logger.console, logger.label + ">"),
        error: logger => logger.console.error.bind(logger.console, logger.label + ">")
    };

    JFactoryLogger.FORMATTER_CLI = {
        log: logger => logger.console.log.bind(logger.console, logger.styles_cli.label, logger.label + ">"),
        warn: logger => logger.console.warn.bind(logger.console, logger.styles_cli.label, logger.label + ">"),
        error: logger => logger.console.error.bind(logger.console, logger.styles_cli.label, logger.label + ">")
    };

    JFactoryLogger.FORMATTER_BROWSER = {
        log: logger => logger.console.log.bind(logger.console, "%c" + logger.label + ">", logger.styles_css.label),
        warn: logger => logger.console.warn.bind(logger.console, "%c" + logger.label + ">", logger.styles_css.label),
        error: logger => logger.console.error.bind(logger.console, "%c" + logger.label + ">", logger.styles_css.label)
    };

    /** @return {boolean} */
    JFactoryLogger.DEFAULT_CONDITION = function(nativeName) {
        {
            JFactoryExpect("JFactoryLogger.condition(nativeName)", nativeName).equalIn(["log", "warn", "error"]);
            JFactoryExpect("JFactoryLogger.enabled", this.enabled).equal(true);
        }
        return !(this.filters[this.label] && this.filters[this.label][nativeName])
    };

    JFactoryLogger.DEFAULT_CONFIG = /** @lends JFactoryLogger# */ {
        label: "",
        enabled: true,
        parentLogger: null,
        condition: JFactoryLogger.DEFAULT_CONDITION,
        formatter:
            !helper_isNative(console.log) || JFACTORY_REPL ? JFactoryLogger.FORMATTER_NATIVE :
                JFACTORY_CLI ? JFactoryLogger.FORMATTER_CLI :
                    JFactoryLogger.FORMATTER_BROWSER
        ,
        console,
        filters: {
        },
        styles_cli: {
            label: "\x1b[1;30m%s\x1b[0m"
        },
        styles_css: {
            label: "color: gray"
        }
    };

    // -----------------------------------------------------------------------------------------------------------------
    // Config JFactoryLogger
    // -----------------------------------------------------------------------------------------------------------------

    const CONFIG$1 = /*#__PURE__*/jFactoryCfg("JFactoryLogger", JFactoryLogger.DEFAULT_CONFIG);

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryPromise
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    // #limitation# async functions always use the native Promise constructor even if native Promise class is overridden
    // #limitation# async functions always returns a native Promise even if returning an extended Promise
    // #limitation# async functions always returns a pending Promise even if returning a resolved Promise

    const moduleGenId = () => ++moduleGenId.uid; moduleGenId.uid = 0;

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryPromise
    // -----------------------------------------------------------------------------------------------------------------

    class JFactoryPromise extends Promise {

        constructor({ name, config, traceSource }, executor) {
            jFactoryBootstrap_expected();

            if (arguments.length === 1) {
                [name, config, executor] = [null, null, arguments[0]];
            }

            const chainId = moduleGenId();
            config = { ...CONFIG, ...config };
            name = name || "unnamed";

            {
                JFactoryExpect("name", name)
                    .type(String, Number)
                    .matchReg(/^[^. ]+$/);
                JFactoryExpect("config", config).typePlainObject();
                JFactoryExpect("executor", executor).typeFunction();
            }

            let resolve;
            let reject;

            super((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            });

            const chain = new JFactoryPromiseChain(this, chainId, name, config);

            Object.defineProperties(this, {
                $chain: {
                    enumerable: true,
                    writable: true,
                    value: chain
                },
                $type: {
                    writable: true,
                    value: "promise"
                },
                $value: {
                    writable: true,
                    value: undefined
                },
                $isSettled: {
                    writable: true,
                    value: false
                },
                $isRejected: {
                    writable: true,
                    value: null
                },
                $isFulfilled: {
                    writable: true,
                    value: null
                },
                $isExpired: {
                    writable: true,
                    value: false
                },
                $isAborted: {
                    writable: true,
                    value: false
                }
            });

            {
                Object.defineProperties(this, {
                    $dev_name: {
                        configurable: true,
                        value: name + "[" + chainId + ":0]"
                    },
                    $dev_path: {
                        writable: true,
                        value: new JFactoryPromisePath(this)
                    },
                    $dev_position: {
                        writable: true,
                        value: 0
                    }
                });
                if (!helper_isNative(executor)) {
                    Object.defineProperties(this, {
                        $dev_source: {
                            value: executor
                        }
                    });
                }
                jFactoryTrace.attachTrace(this, traceSource);
            }

            const tryAutoComplete = () => {
                if (!this.$chain.isPending) {
                    try {
                        this.$chainComplete("auto-completed");
                    } catch (e) {
                        // Case of error in "complete" callback
                        // We catch the exception because the promise is already fulfilled
                        // Furthermore this issue must be handled by the chain, not the current promise
                        console.error(e); // print the error otherwise nothing happens
                    }
                }
            };

            const onResolve = value => {
                // console.trace("onResolve", this.$dev_name);
                if (!this.$isSettled) {
                    // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
                    if (value === this) {
                        onReject(new TypeError("Chaining cycle detected for promise " + this.$dev_name));
                        return;
                    }

                    let then;
                    if (value !== null && (typeof value == "object" || typeof value == "function")) {
                        // 2.3.3.2. If retrieving the property x.then results in a thrown exception e,
                        // reject promise with e as the reason.
                        try {
                            then = value.then;
                        } catch (e) {
                            onReject(e);
                            return;
                        }
                    }

                    if (typeof then == "function") {
                        let called = false;
                        let resolvePromise = function(y) {
                            // 2.3.3.3.1. If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                            if (!called) {
                                called = true;
                                onResolve(y);
                            }
                        };
                        let rejectPromise = function(r) {
                            // 2.3.3.3.2. If/when rejectPromise is called with a reason r, reject promise with r.
                            if (!called) {
                                called = true;
                                onReject(r);
                            }
                        };

                        try {
                            // 2.3.3.3: If `then` is a function, call it as x.then(resolvePromise, rejectPromise)
                            then.call(value, resolvePromise, rejectPromise);
                        } catch (e) { // 2.3.3.3.4. If calling then throws an exception e,
                            // 2.3.3.3.4.1. If resolvePromise or rejectPromise have been called, ignore it.
                            if (!called) {
                                // 2.3.3.3.4.2. Otherwise, reject promise with e as the reason.
                                onReject(e);
                            }
                        }
                    }
                    else {
                        this.$isRejected = false;
                        this.$isFulfilled = true;
                        if (this.$isExpired) {
                            value = this.$chain.errorExpired;
                        }
                        resolve(value);
                        onSettle(value);
                    }
                }
            };

            const onReject = reason => {
                // console.log("onReject", this.$dev_name);
                if (!this.$isSettled) {
                    this.$isRejected = true;
                    this.$isFulfilled = false;
                    reject(reason);
                    onSettle(reason);
                }
            };

            const onSettle = value => {
                this.$value = value;
                this.$isSettled = true;
                this.$chain.chainMap.set(this, true);

                if (this.$chain.chainConfig.chainAutoComplete) {
                    if (this.$chain.chainMap.size === 1 && !this.$isExpired) {
                        // ensures that tryAutoComplete() will be called asynchronously (then() callback is asynchronous)
                        // case of promise.resolve(primitive), prevents following then() from being immediately locked
                        this.then(tryAutoComplete);
                    } else {
                        tryAutoComplete();
                    }
                }
            };

            let _chainAutoComplete = config.chainAutoComplete;
            Object.defineProperty(config, "chainAutoComplete", {
                get: () => _chainAutoComplete,
                set: value => {
                    if (_chainAutoComplete !== value) {
                        _chainAutoComplete = value;
                        if (value) {
                            tryAutoComplete();
                        }
                    }
                }
            });

            chain.chainMap.set(this, false);

            Object.defineProperties(this, {
                __resolve__: {
                    value: onResolve
                },
                __reject__: {
                    value: onReject
                }
            });

            try {
                executor(onResolve, onReject);
            } catch (e) {
                // console.error("exception in executor", this.$dev_name);
                onReject(e);
            }
        }

        then(onFulfilled, onRejected, forceType) {
            let wrappedFulfilled;
            let wrappedRejected;
            let newPromise;

            // Caution: "await" detection is not reliable.
            // Passing native functions for both onFulfilled and onRejected will
            // result to "await" type and may cause side effects
            let type = forceType || (
                helper_isNative(onFulfilled) && !onFulfilled.name.startsWith("bound ") &&
                helper_isNative(onRejected) && !onRejected.name.startsWith("bound ")
                    ? "await" : onFulfilled === undefined ? "catch" : "then"
            );

            if (onFulfilled && typeof onFulfilled === "function") {
                wrappedFulfilled = function(r) {
                    // "await" must always run the native handler
                    if (type === "await") {
                        // SPEC: "await" throws the errorExpired if $isAborted is true.
                        // Allows async function to try catch the awaited aborted promise
                        // or, if not caught, breaks and ignore the rest of the async function.
                        if (newPromise.$isAborted) {
                            return onRejected(newPromise.$chain.errorExpired)
                        } else {
                            return onFulfilled(r)
                        }
                    }
                    // otherwise don't call the handler if expired
                    if (!newPromise.$isExpired) {
                        if (newPromise.$isSettled) {
                            // eslint-disable-next-line no-debugger
                            debugger
                        }
                        return onFulfilled(r)
                    }
                };
            }
            if (onRejected && typeof onRejected === "function") {
                wrappedRejected = function(r) {
                    if (newPromise.$isSettled) {
                        // eslint-disable-next-line no-debugger
                        debugger
                    }
                    return onRejected(r)
                };
            }

            newPromise = Object.assign(super.then(wrappedFulfilled, wrappedRejected), this);
            moduleGenId.uid--; // reverse because not a new chain
            newPromise.$type = type;

            Object.defineProperties(newPromise, {
                __onFulfilled__: { value: onFulfilled },
                __onRejected__: { value: onRejected }
            });

            {
                newPromise.$dev_position = this.$chain.chainMap.size;
                let fNames = "";
                if (onFulfilled && onFulfilled.name) {
                    fNames += onFulfilled.name;
                }
                if (onRejected && onRejected.name) {
                    fNames += "," + onRejected.name;
                }
                Object.defineProperties(newPromise, {
                    $dev_name: {
                        value:
                            this.$chain.chainName
                            + "["
                            + this.$chain.chainId
                            + ":"
                            + this.$dev_position
                            + "]"
                            + "."
                            + newPromise.$type
                            + (fNames ? "(" + fNames + ")" : "")
                            + "["
                            + newPromise.$chain.chainId
                            + ":"
                            + newPromise.$dev_position
                            + "]"
                    },
                    $dev_path: { value: new JFactoryPromisePath(this.$dev_path, newPromise) }
                });
            }

            newPromise.$chain.chainMap.set(newPromise, false);

            if (this.$isExpired) {
                // case: p0.then(); chainAbort(); p1.then()
                // => the new promise must be expired
                // if parent promise is just expired, abort silently
                // if parent promise is aborted, abort explicitly

                // JFactoryPromise.setExpired(newPromise, true, !this.$isAborted, this.$chain.errorExpired);
                JFactoryPromise.setExpired(newPromise, this.$isAborted, true);
            }

            return newPromise
        }

        static resolve(optionalArgs, value) {
            // resolve()
            // resolve(optionalArgs, value)
            // resolve(value)

            if (arguments.length === 1) {
                [optionalArgs, value] = [{}, optionalArgs];
            }
            if (!optionalArgs) {
                optionalArgs = {};
            }
            if (value instanceof this && arguments.length === 1) {
                // Returns the promise as is (native spec)
                // but only if no optionalArgs
                return value
            } else {
                return new this(optionalArgs, function(resolve) {
                    resolve(value);
                });
            }
        }

        static reject(optionalArgs, reason) {
            // reject()
            // reject(optionalArgs, reason)
            // reject(reason)

            if (arguments.length === 1) {
                [optionalArgs, reason] = [{}, optionalArgs];
            }
            if (!optionalArgs) {
                optionalArgs = {};
            }
            return new this(optionalArgs, function(resolve, reject) {
                reject(reason);
            });
        }

        // $toPromise(rejectIfExpired = true) {
        //     return new Promise((resolve, reject) => {
        //         let promise = this.then(resolve, e => {
        //             debugger
        //             reject(e)
        //         });
        //         if (rejectIfExpired) {
        //             promise.$thenIfExpired(reject)
        //         }
        //     })
        // }

        // $toNewChain(abortIfExpired = true) {
        //     let newChain;
        //     return newChain = new JFactoryPromise((resolve, reject) => {
        //         let promise = this.then(resolve, e => {
        //             debugger
        //             reject(e)
        //         });
        //         if (abortIfExpired) {
        //             promise.$thenIfExpired(function(e){
        //                 newChain.$chainAbort(e)
        //             })
        //         }
        //     });
        // }

        // A "then" where the handler is called only if the chain is expired
        // it's not a catch (a catchExpired concept should cancel the expiration)
        $thenIfExpired(onExpired) {
            return this.then(r => this.$chain.chainRoot.$isExpired ? onExpired(r) : r,
                undefined, "$thenIfExpired"
            )
        }

        // Completes an expires the whole chain before its normal end
        // Sets the $isAborted to true on aborted promises
        $chainAbort(reason = "$chainAbort()") {
            this.$chain.complete(reason, true);
            return this
        }

        // Manually completes and expires the whole chain
        // Only required if awaiting "myPromise.$chain"
        // when the autocomplete watcher is not used
        $chainComplete(reason = "$chainComplete()") {
            if (this.$chain.isPending) {
                throw new JFACTORY_ERR_INVALID_CALL({
                    target: this,
                    reason: "Trying to complete a pending chain. Use $chainAbort() if you want to stop it."
                });
            }
            this.$chain.complete(reason, false);
            return this
        }

        $chainAutoComplete() {
            this.$chain.chainConfig.chainAutoComplete = true;
            return this
        }

        static setExpired(promise, abort, silent /*, reason*/) {
            promise.$isExpired = true;
            if (!promise.$isSettled) {
                if (promise.$type === "$thenIfExpired") {
                    promise.__onFulfilled__(promise.$chain.chainRoot.$chain.errorExpired);
                }
                else if (abort) {
                    promise.$isAborted = true;
                } else {
                    if (!silent) {
                        throw new JFACTORY_ERR_INVALID_CALL({
                            target: promise,
                            reason: "promise must be aborted or settled before setting it to expired."
                        })
                    }
                }
                promise.__resolve__(/*reason*/);
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryPromiseChain
    // -----------------------------------------------------------------------------------------------------------------

    class JFactoryPromiseChain {

        constructor(chainRoot, chainId, chainName, chainConfig) {
            Object.defineProperties(this, {
                chainConfig: { value: chainConfig },
                chainRoot: { value: chainRoot },
                chainId: { value: chainId },
                chainName: { value: chainName },
                chainMap: { value: new Map },
                isCompleted: { value: false, configurable: true },
                data: { value: {} },
                __deferred__: { value: helper_deferred() }
            });
        }

        get isPending() {
            return Array.from(this.chainMap.values()).includes(false)
        }

        then(onResolve) { // => "await chain"
            this.__deferred__.done(onResolve);
            return this
        }

        complete(reason = "chain.complete()", abort) {
            let chainRoot = this.chainRoot;
            if (!chainRoot.$isExpired) {
                /*let errorExpired = */chainRoot.$chain.errorExpired = new JFACTORY_ERR_PROMISE_EXPIRED({
                    target: chainRoot,
                    reason
                });

                let map = this.chainMap;
                for (let item of map.keys()) {
                    JFactoryPromise.setExpired(item, abort/*, false, errorExpired*/);
                }

                Object.defineProperty(this, "isCompleted", { value: true });
                this.__deferred__.resolve();
            }
            return this
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryPromisePath
    // -----------------------------------------------------------------------------------------------------------------

    class JFactoryPromisePath extends Array {

        constructor() {
            super();
            for (let i of arguments) {
                if (Array.isArray(i)) {
                    this.push(...i);
                } else {
                    this.push(i);
                }
            }
        }

        get printable() {
            return this.map((v, i) => i === 0 ? v.$dev_name : v.$dev_name.split(".")[1]).join(".")
        }

        toString() {return this.printable}
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryPromiseSync
     * -----------------------------------------------------------------------------------------------------------------
     * Promise that tries to resolve synchronously
     * allowing synchronous states and result
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryPromiseSync extends Promise {

        constructor(executor) {

            let states = {
                $isSettled: false, // true = not pending
                $isRejected: null, // true = not pending + rejected
                $value: undefined
            };

            super((resolve, reject) => {

                let called = false;

                let onResolve = r => {
                    if (r instanceof Promise) {
                        JFactoryPromiseSync.resolve(r)
                            .then(onResolve, onReject);
                    } else {
                        if (!called) {
                            called = true;
                            states.$isSettled = true;
                            states.$isRejected = false;
                            states.$value = r;
                            resolve(r);
                        }
                    }
                };

                let onReject = r => {
                    // don't resolve pending promise
                    // to keep native specification
                    if (!called) {
                        called = true;
                        states.$isSettled = true;
                        states.$isRejected = true;
                        states.$value = r;
                        reject(r);
                    }
                };

                try {
                    executor(onResolve, onReject);
                } catch (e) {
                    onReject(e);
                }
            });

            Object.assign(this, states);
            states = this;
        }

        then(onFulfilled, onRejected) {

            if (this.$isSettled) {
                let value = this.$value;

                try {
                    if (this.$isRejected) {
                        // cancel any uncaught rejected result from this promise
                        // before returning the new one
                        super.then(undefined, () => null);

                        if (onRejected && typeof onRejected === "function") {
                            value = onRejected(value);
                        } else {
                            return JFactoryPromiseSync.reject(value)
                        }
                    } else {
                        if (onFulfilled && typeof onFulfilled === "function") {
                            value = onFulfilled(value);
                        }
                    }
                } catch (e) {
                    return JFactoryPromiseSync.reject(e)
                }

                return JFactoryPromiseSync.resolve(value)

            } else {
                return super.then(onFulfilled, onRejected)
            }
        }

        static resolve(value) {
            if (value instanceof JFactoryPromiseSync) {
                return value
            } else {
                if (value instanceof Promise) {
                    return new JFactoryPromiseSync(value.then.bind(value))
                } else {
                    return new JFactoryPromiseSync(r => r(value))
                }
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Config JFactoryPromise
    // -----------------------------------------------------------------------------------------------------------------

    const CONFIG = /*#__PURE__*/jFactoryCfg("JFactoryPromise", {
        chainAutoComplete: false
    });

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryEvents
     * -----------------------------------------------------------------------------------------------------------------
     * https://learn.jquery.com/events/event-extensions/
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryEvents {
        // -------------------------------------------------------------------------------------------------------------
        // jQuery doesn't handle async trigger so jFactory provides the following :
        //
        // - triggerParallel(): the trigger function returns a Promise.all(pendingArray)
        //   where pendingArray is filled by any async running handler.
        //   Not recommended because it's the best way to produce unpredictable async side effects
        //
        // - triggerSeries(): handlers are run in a synchronous order, with "await"
        //   This avoids unpredictable async race condition
        //
        //  Both returns a JFactoryPromiseSync that contains the jFactory_fulfilled flag
        //  This flag is immediately (not async) set to true if no async handler is still pending
        //
        // => handlers are wrapped. OriginalHandlers and wrappedHandlers relations are stored in a WeakMap
        // -------------------------------------------------------------------------------------------------------------

        constructor() {
            Object.defineProperties(this, /** @lends JFactoryEvents# */ {
                registry: { value: jQuery(Object.create(null)) },
                handlers: { value: new WeakMap },
                onListenerUpdate: { value: null, writable: true },
                onObserverUpdate: { value: null, writable: true }
            });
        }

        on({ events, handler, target, selector }) {
            {
                JFactoryEvents.validateSelector(events);
                JFactoryExpect("JFactoryEvents.on({handler})", handler).typeFunction();
                target && JFactoryExpect("JFactoryEvents.on({target})", target).type(String, jQuery, HTMLElement);
                selector && JFactoryExpect("JFactoryEvents.on({selector})", target).typeString();
            }

            let wrappedHandler = this.handlers.get(handler);
            if (target) {
                // don't need to wrap DOM handlers
                if (!wrappedHandler) {
                    this.handlers.set(handler, true);
                }
                if (selector) {
                    jQuery(target).on(events, selector, handler);
                } else {
                    jQuery(target).on(events, handler);
                }
                if (this.onListenerUpdate) {
                    this.onListenerUpdate(arguments);
                }
            } else {
                if (!wrappedHandler) {
                    this.handlers.set(handler, wrappedHandler = function(e, { data, stack }) {
                        stack.push(() => handler(e, data));
                    });
                    wrappedHandler.originalHandler = handler;
                }
                this.registry.on(events, wrappedHandler);
                if (this.onObserverUpdate) {
                    this.onObserverUpdate(arguments);
                }
            }
        }

        off({ events, handler, target, selector }) {
            {
                if (events !== undefined) { // off() is valid
                    JFactoryEvents.validateSelector(events);
                    handler && JFactoryExpect("JFactoryEvents.off({handler})", handler).typeFunction();
                    target && JFactoryExpect("JFactoryEvents.off({target})", target).type(String, jQuery, HTMLElement);
                    selector && JFactoryExpect("JFactoryEvents.off({selector})", target).typeString();
                }
            }

            if (target) {
                if (selector) {
                    jQuery(target).off(events, selector, handler);
                } else {
                    jQuery(target).off(events, handler);
                }
            } else {
                jQuery("*").off(events, handler);

                if (handler) {
                    handler = this.handlers.get(handler);
                    if (!handler) {
                        throw new JFACTORY_ERR_INVALID_VALUE({
                            target: "handler",
                            reason: "not registered",
                            given: handler
                        })
                    }
                }
                this.registry.off(events, handler);
            }
            if (this.onObserverUpdate) {
                this.onObserverUpdate(arguments);
            }
            if (this.onListenerUpdate) {
                this.onListenerUpdate(arguments);
            }
        }

        /**
         * Run in parallel. Don't "await" for async handlers
         * Obviously produces unpredictable race conditions
         */
        triggerParallel({ events, data, target }) {
            {
                JFactoryEvents.validateSelector(events);
                target
                    && JFactoryExpect("JFactoryEvents.triggerParallel({target})", target).type(String, jQuery, HTMLElement);
            }

            const stack = [];
            const pending = [];
            events = events.split(" ");

            if (target) {
                for (let event of events) {
                    jQuery(target).trigger(event, { data, stack });
                }
            } else {
                for (let event of events) {
                    this.registry.triggerHandler(event, { data, stack });
                }
            }

            for (let handler of stack) {
                let result = handler();
                if (result instanceof Promise
                    && !result.$isSettled // don't need to await
                ) {
                    pending.push(result);
                }
            }

            if (pending.length) {
                return Promise.all(pending)
            } else {
                return JFactoryPromiseSync.resolve()
            }
        }

        /**
         * Run in declaration order synchronously. Will "await" for async handlers
         * Prevents unpredictable race conditions
         */
        triggerSeries({ events, data, target }) {
            {
                JFactoryEvents.validateSelector(events);
                target && JFactoryExpect("JFactoryEvents.triggerSeries({target})", target).type(String, jQuery, HTMLElement);
            }

            return new JFactoryPromiseSync(async resolve => {
                const stack = [];
                events = events.split(" ");

                if (target) {
                    for (let event of events) {
                        jQuery(target).trigger(event, { data, stack });
                    }
                } else {
                    for (let event of events) {
                        this.registry.triggerHandler(event, { data, stack });
                    }
                }

                for (let handler of stack) {
                    let result = handler();
                    if (result instanceof Promise
                        && !result.$isSettled // don't need to await
                    ) {
                        await result;
                    }
                }
                resolve();
            })
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryEventsManager
    // -----------------------------------------------------------------------------------------------------------------

    class JFactoryEventsManager extends JFactoryEvents {
        constructor(parent) {
            super();
            Object.defineProperties(this, {
                parent: { value: parent },
                affiliateRules: { value: new JFactoryFunctionComposer().compose() }
            });
            this.affiliateAddRule(JFactoryEventsManager.rule_namespace);
        }

        affiliate(events = "", namespaces = "", options) {
            let parser = new JFactoryEventSelectorParser(events);
            for (let parsedEvent of parser.events) {
                this.affiliateRules(parsedEvent, namespaces, options);
            }
            return parser.toString();
        }

        affiliateAddRule(handler) {
            this.affiliateRules.composer.last(handler);
        }

        static rule_namespace(context, parsedEvent, namespaces) {
            namespaces = namespaces.split(".");
            for (let namespace of namespaces) {
                namespace && parsedEvent.addNamespace(namespace);
            }
        }

        on(events, target, selector, handler, options) {
            // Observers:
            // events, handler
            // events, handler, options

            // DOM Events:
            // events, target, handler
            // events, target, handler, options
            // events, target, selector, handler,
            // events, target, selector, handler, options

            switch (arguments.length) {
                case 2:
                    // events, handler
                    [handler, target] = [target/*, undefined*/];
                    break;
                case 3:
                    if (typeof arguments[2] === "function") {
                        // events, target, handler
                        [handler, selector] = [selector/*, undefined*/];
                    } else {
                        // events, handler, options
                        [handler, options, target, selector] = [target, selector/*, undefined, undefined*/];
                    }
                    break;
                case 4:
                    if (typeof arguments[3] === "object") {
                        // events, target, handler, options
                        [options, handler, selector] = [handler, selector/*, undefined*/];
                    }
                    break;
            }

            events = this.affiliate(events, this.parent.$.about.fingerprint, options);

            target === undefined ?
                super.on({ events, handler }) :
                super.on({ events, target, selector, handler/*, options*/ });
        }

        off(events, target, selector, handler, options) {
            // Both:
            // events (can be namespaces)
            // events, options
            // options (can be removal)

            // Observer:
            // events, handler
            // events, handler, options

            // DOM Events:
            // events, target, handler
            // events, target, handler, options
            // events, target, selector
            // events, target, selector, handler,
            // events, target, selector, handler, options

            const argL = arguments.length;
            switch (argL) {
                case 1:
                    if (typeof arguments[0] === "object") {
                        // options
                        [options, events] = [events/*, undefined*/];
                    }
                    // else events (can namespaces)
                    break;
                case 2:
                    if (typeof arguments[1] === "function") {
                        // events, handler
                        [handler, target] = [target/*, undefined*/];
                    } else if (helper_isPlainObject(arguments[1])) {
                        // events, options
                        [options, target] = [target/*, undefined*/];
                    }
                    // else events, target
                    break;
                case 3:
                    if (typeof arguments[2] === "function") {
                        // events, target, handler
                        [handler, selector] = [selector/*, undefined*/];
                    } else if (typeof arguments[1] === "function") {
                        // events, handler, options
                        [handler, options, target, selector] = [target, selector/*, undefined, undefined*/];
                    } else ;
                    break;
                case 4:
                    if (typeof arguments[3] === "object") {
                        // events, target, handler, options
                        [options, handler, selector] = [handler, selector/*, undefined*/];
                    }
                    break;
            }

            events = this.affiliate(events, this.parent.$.about.fingerprint, options);

            if (argL < 2) {
                super.off({ events });
            } else {
                target ?
                    super.off({ events, target, selector, handler/*, options*/ }) :
                    super.off({ events, handler });
            }
        }

        trigger(events, target, data) {
            // events
            // events, target
            // events, data
            // events, target, data

            switch (arguments.length) {
                case 2:
                    if (typeof target === "object" && !target.jquery) {
                        // events, data
                        [data, target] = [target];
                    }
                    // events, target
                    break
            }

            return target ?
                super.triggerSeries({ events, target, data }) :
                super.triggerSeries({ events, data })
        }

        triggerParallel(events, target, data) {
            // events
            // events, target
            // events, data
            // events, target, data

            switch (arguments.length) {
                case 2:
                    if (typeof target === "object" && !target.jquery) {
                        // events, data
                        [data, target] = [target];
                    }
                    // events, target
                    break
            }

            return target ?
                super.triggerParallel({ events, target, data }) :
                super.triggerParallel({ events, data })
        }

        // #unoptimized draft#
        // It's not easy to keep this list up to date because:
        // - listeners can be removed by external dom mutations
        // - listeners can be delegated
        // - off() method can remove listeners globally
        getDomListeners(namespace) {
            let result = new Map();
            for (let elm of jQuery("*")) {
                let data = jQuery._data(elm, "events");
                if (data) {// data = {click: [{}], ... }
                    for (let entries of Object.values(data)) {// entries = [{type:...}]
                        for (let entry of entries) {// entry = {type, namespace, handler, ...}
                            let parser = new JFactoryEventSelector(entry.namespace);
                            let types;
                            if (parser.hasNamespace(namespace)) {
                                if (!(types = result.get(elm))) {
                                    result.set(elm, types = {});
                                }
                                let type = types[entry.type] || (types[entry.type] = []);
                                type.push({
                                    // ...entry,
                                    selector: entry.selector || null,
                                    handler: entry.handler,
                                    namespace: entry.namespace
                                });
                            }
                        }
                    }
                }
            }
            return result
        }

        // #unoptimized draft#
        getObservers() {
            let result = new Map();
            let events = this.registry._events;

            if (!events) {
                let registry = Object.values(this.registry)[0];
                let expando = Object.getOwnPropertyNames(registry).find(k => k.indexOf("jQuery") === 0);
                if (registry && expando) {
                    events = this.registry._events = registry[expando].events;
                }
            }

            if (events) {
                for (let [key, val] of Object.entries(events)) {
                    let event = result.get(key);
                    if (!event) {
                        event = [];
                        result.set(key, event);
                    }
                    for (let eventTypeEntry of val) {
                        event.push({
                            handler: eventTypeEntry.handler.originalHandler,
                            namespace: eventTypeEntry.namespace
                        });
                    }
                }
            }

            return result
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryEventSelectorParser
    // -----------------------------------------------------------------------------------------------------------------

    class JFactoryEventSelectorParser {
        constructor(selectors) {
            {
                JFactoryEvents.validateSelector(selectors);
            }
            /**
             * @type Array<JFactoryEventSelector>
             */
            this.events = selectors.split(" ").map(selector => new JFactoryEventSelector(selector));
        }

        toString() {
            let s = [];
            for (let event of this.events) {
                s.push(event.toString());
            }
            return s.join(" ")
        }
    }

    class JFactoryEventSelector {
        constructor(selector) {
            let [event, ...namespace] = selector.split(".");
            this.event = event;
            this.namespace = new Set(namespace);
        }

        /** @return {Boolean|String} */
        hasNamespace(namespaces) {
            if (!Array.isArray(namespaces)) {
                namespaces = [namespaces];
            }
            for (let namespace of namespaces) {
                {
                    if (!/^[\w:]+$/.test(namespace)) {
                        throw new JFACTORY_ERR_INVALID_VALUE({
                            target: "namespace",
                            reason: "must be alphanumeric, underscore and colon characters",
                            given: namespace
                        })
                    }
                }
                if (namespace && this.namespace.has(namespace)) {
                    return namespace
                }
            }
            return false
        }

        addNamespace(namespace) {
            {
                if (!/^[\w:]+$/.test(namespace)) {
                    throw new JFACTORY_ERR_INVALID_VALUE({
                        target: "namespace",
                        reason: "must be alphanumeric, underscore and colon characters",
                        given: namespace
                    })
                }
            }
            this.namespace.add(namespace);
        }

        deleteNamespace(namespace) {
            {
                if (!/^[\w:]+$/.test(namespace)) {
                    throw new JFACTORY_ERR_INVALID_VALUE({
                        target: "namespace",
                        reason: "must be alphanumeric, underscore and colon characters",
                        given: namespace
                    })
                }
            }
            this.namespace.delete(namespace);
        }

        toString() {
            return this.namespace.size ? this.event + "." + Array.from(this.namespace.values()).join(".") : this.event;
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // JFactoryEvents validation
    // -----------------------------------------------------------------------------------------------------------------

    {
        JFactoryEvents.validateSelector = function(selector) {
            {
                JFactoryExpect("JFactoryEvents.validateSelector(selector)", selector)
                    .notUndefined()
                    .validSpaces();
            }

            for (let [event, ns] of selector.split(" ")
                .map(v => v.split("."))
                .map(v => [v.shift(), v.join(".")])) {
                event && JFactoryEvents.validateEvent(event);
                ns && JFactoryEvents.validateNamespace(ns);
            }
            return true
        };

        JFactoryEvents.validateEvent = function(event) {
            {
                JFactoryExpect("JFactoryEvents.validateEvent(event)", event)
                    .notUndefined()
                    .notEmptyString()
                    .validSpaces();
            }

            if (!/^[\w:]+$/.test(event)) {
                throw new JFACTORY_ERR_INVALID_VALUE({
                    target: "JFactoryEvents.validateEvent(event)",
                    reason: "must be alphanumeric, underscore and colon characters",
                    given: event
                })
            }

            return true
        };

        JFactoryEvents.validateNamespace = function(namespace) { // ex: ns.ns2.ns3
            {
                JFactoryExpect("JFactoryEvents.validateNamespace(namespace)", namespace)
                    .notUndefined()
                    .notEmptyString()
                    .validSpaces();
            }

            if (!/^[\w:.]+$/.test(namespace)) {
                throw new JFACTORY_ERR_INVALID_VALUE({
                    target: "JFactoryEvents.validateNamespace(namespace)",
                    reason: "must be alphanumeric, underscore, dot and colon characters",
                    given: namespace
                })
            }

            return true
        };
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryTime
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */
    class JFactoryTime extends Date {
        toString() {
            return this.toLocaleTimeString() + ", " + this.getUTCMilliseconds() + "ms (" + this.valueOf() + ")"
        }
        $toDurationString() {
            let hours = this.getUTCHours();
            let minutes = this.getUTCMinutes();
            let seconds = this.getUTCSeconds();
            let milliseconds = this.getUTCMilliseconds();

            let a = [];
            if (hours) {
                a.push(hours + "h");
            }
            if (minutes) {
                a.push(minutes + "min");
            }
            if (seconds) {
                a.push(seconds + "s");
            }
            a.push(milliseconds + "ms");
            if (a.length === 1) {
                return a[0];
            } else {
                return a.join(",") + " (" + this.valueOf() + ")";
            }
        }
    }

    class JFactoryTimeTrace extends Date {
        constructor() {
            super();
            this.elapsed = null;
            Object.defineProperties(this, {
                t1: { value: null, writable: true },
                t0: { value: new JFactoryTime() }
            });
        }
        end() {
            this.t1 = new JFactoryTime();
            this.elapsed = new JFactoryTime(this.t1 - this.t0).$toDurationString();
        }
        toString() {
            return this.elapsed
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * -----------------------------------------------------------------------------------------------------------------
     * TraitCore
     * -----------------------------------------------------------------------------------------------------------------
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Core
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitCore {
        trait_constructor() {
            const owner = this;

            class SubMap extends Map {
                constructor(...args) {
                    super(...args);
                    Object.defineProperty(this, "id_autoinc", { value: 0, writable: true });
                }
                $registerSync(key, value) {
                    let sub = Object.defineProperties({}, {
                        $value: { value },
                        $phaseRemove: { value: TraitService.getContextualRemovePhase(owner) }
                    });
                    this.set(key, sub);
                    return sub
                }
                $registerAsync(key, taskName, promise) {
                    let task = owner.$task(taskName, promise.$chain);

                    // End of promise chain must complete the task
                    promise.$chain.then(() => { // synchronous then
                        task.$chainAutoComplete();
                    });

                    // Aborted task must abort the promise if still running
                    task.$chain.then(() => {// synchronous then
                        if (!promise.$chain.isCompleted) {
                            promise.$chainAbort("aborted by task");
                        }
                    });

                    Object.defineProperty(promise, "$phaseRemove", { value: task.$phaseRemove });
                    this.set(key, promise);
                    return task
                }

                $id_resolve(str) {
                    if (str.indexOf("?") >= 0) {
                        let id = ++this.id_autoinc;
                        str = str.replace(/\?/g, id);
                    }
                    return str
                }
            }

            const proto = Object.assign(Object.create(null), {
                [TraitCore.SYMBOL_PRIVATE]: Object.create(null),
                assign: function(property, value, descriptor) {JFactoryObject.assign(this, property, value, descriptor);},
                createSubMap: () => new SubMap()
            });

            Object.defineProperty(this, "$", { value: Object.create(proto) });

            // pre-define most important properties
            // to order them first in devtool (reduced form only)
            this.$.assign({
                tasks: null,
                requests: null
            }, JFactoryObject.descriptors.ENUMERABLE_WRITABLE);
        }
    }

    TraitCore.SYMBOL_PRIVATE = Symbol("_");

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait About
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitAbout {

        trait_constructor(about) {
            JFactoryObject.assign(this.$, "about",
                new JFactoryAbout(this, about), JFactoryObject.descriptors.READONLY);
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Log
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitLog {

        trait_constructor() {
            let config = Object.assign({
                label: this.$.about.name
            }, JFACTORY_LOG || {
                enabled: false
            });

            let logger = new JFactoryLogger(config);

            Object.defineProperty(this.$, "logger", { value: logger });

            logger.installAccessor("log",   "$log",     this);
            logger.installAccessor("warn",  "$logWarn", this);
            logger.installAccessor("error", "$logErr",  this);
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Tasks
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitTask {

        trait_constructor() {
            this.$.assign("tasks", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $task(id, executorOrValue) {
            id = this.$.tasks.$id_resolve(id);

            {
                JFactoryExpect("$task(id)", id).typeString();
                JFactoryExpect("$task(executorOrValue)", executorOrValue).notUndefined();
                if (this.$.tasks.has(id)) {
                    throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$task(id)", given: id })
                }
            }

            let task;

            if (typeof executorOrValue === "function") {
                task  = new JFactoryPromise({ name: id, owner: this }, executorOrValue);
            } else {
                task = JFactoryPromise.resolve({ name: id, owner: this }, executorOrValue);
            }

            task.$phaseRemove = TraitService.getContextualRemovePhase(this);

            let metrics;
            {
                metrics = new JFactoryTimeTrace();
                task.$taskMetrics = { $dev_timing: metrics };
            }

            task.$chain.then(() => {
                {
                    metrics.end();
                }
                if (this.$.tasks.get(id)) {
                    this.$taskRemove(id);
                }
            });

            this.$.tasks.set(id, task);
            return task
        }

        $taskRemove(id, reason) {
            {
                JFactoryExpect("$taskRemove(id)", id).typeString();
                reason && JFactoryExpect("$taskRemove(reason)", reason).typeString();
                if (!this.$.tasks.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$taskRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger
                if (this.$.tasks.get(id)._called) {debugger}
                this.$.tasks.get(id)._called = true;
            }

            let entry = this.$.tasks.get(id);
            // deleting before chainAbort() to prevent remove() recall
            this.$.tasks.delete(id);
            entry.$chainAbort(reason || "$taskRemove()");
        }

        $taskRemoveAll(removePhase) {
            {
                JFactoryExpect("$taskRemoveAll(removePhase)", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let tasks = this.$.tasks;
            if (tasks.size) {
                for (const [key, task] of tasks) {
                    if (task.$phaseRemove === removePhase) {
                        this.$taskRemove(key, "$taskRemoveAll(" + removePhase + ")");
                    }
                }
            }
        }

        $taskPromiseAll(autoComplete = false) {
            let pending = [];
            if (this.$.tasks.size) {
                for (let task of this.$.tasks.values()) {
                    if (autoComplete) {
                        // resolves the chain as soon as no more pending promise in the chain
                        task.$chain.chainConfig.chainAutoComplete = true;
                    }
                    // still pending ?
                    if (task.$chain.isPending) {
                        pending.push(task.$chain);
                    }
                }
            }
            if (pending.length) {
                return JFactoryPromise.all(pending);
            } else {
                return JFactoryPromiseSync.resolve()
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Events
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitEvents {

        trait_constructor() {
            assignPrivate(this, "events", {
                custom: new JFactoryEventsManager(this),
                kernel: new JFactoryEventsManager(this)
            }, JFactoryObject.descriptors.NONE);

            let eventManager = this.$[TraitCore.SYMBOL_PRIVATE].events.custom;

            // if (JFACTORY_DEV) { // very slow; requires optimization
            //     // registry are auto updated in dev mode (unoptimized implementation)
            //
            //     let listenerUpdate = () => {
            //         this.$.listeners = eventManager.getDomListeners(this.$.about.fingerprint);
            //     };
            //     let observerUpdate = () => {
            //         this.$.observers = eventManager.getObservers();
            //     };
            //
            //     eventManager.onListenerUpdate = listenerUpdate;
            //     eventManager.onObserverUpdate = observerUpdate;
            //
            //     let observer = new MutationObserver(listenerUpdate);
            //     observer.observe(document.documentElement, {childList: true, subtree: true});
            //
            //     listenerUpdate();
            //     observerUpdate();
            // } else
            {
                Object.defineProperties(this.$, {
                    listeners: {
                        get: eventManager.getDomListeners.bind(eventManager, this.$.about.fingerprint),
                        enumerable: true
                    },
                    observers: {
                        get: eventManager.getObservers.bind(eventManager),
                        enumerable: true
                    }
                });
            }
        }

        $on(/* events, target, selector, handler, options */) {
            this.$[TraitCore.SYMBOL_PRIVATE].events.custom.on(...arguments);
        }

        $off(/* events, target, selector, handler, options */) {
            this.$[TraitCore.SYMBOL_PRIVATE].events.custom.off(...arguments);
        }

        $trigger(/* events, target, data */) {
            return this.$[TraitCore.SYMBOL_PRIVATE].events.custom.trigger(...arguments)
        }

        $triggerParallel(/* events, target, data */) {
            return this.$[TraitCore.SYMBOL_PRIVATE].events.custom.triggerParallel(...arguments)
        }

        $notify(events, data) {
            return this.$trigger(events, data)
                .then(() => this.$[TraitCore.SYMBOL_PRIVATE].events.kernel.trigger(events, data))
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait State
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitState {

        trait_constructor() {
            const states = Object.create(null);
            const stateRoutes = Object.create(null);
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;

            assignPrivate(this, { states, stateRoutes }, JFactoryObject.descriptors.READONLY);

            JFactoryObject.assign(this.$, "states", new Proxy(states, {
                set: (target, key, val) => this.$state(key, val),
                get: (target, key) => states[key]
            }), JFactoryObject.descriptors.READONLY);

            kernel.on("beforeStateChange", (e, data) => {
                let h;
                if (stateRoutes[data.key] && stateRoutes[data.key].before
                    && (h = stateRoutes[data.key].before(data.val))) {
                    return this.$notify(h);
                }
            });

            kernel.on("afterStateChange", (e, data) => {
                let h;
                if (stateRoutes[data.key] && stateRoutes[data.key].after
                    && (h = stateRoutes[data.key].after(data.val))) {
                    return this.$notify(h);
                }
            });
        }

        $state(key, val, notify = true) {
            {
                JFactoryExpect("$state(key)", key).typeString();
                JFactoryExpect("$state(notify)", notify).typeBoolean();
            }

            return new JFactoryPromiseSync(async resolve => {

                let states = this.$[TraitCore.SYMBOL_PRIVATE].states;
                let previousVal = states[key];
                let pending;

                if (!(key in states) || previousVal !== val) {

                    pending = notify && this.$notify("beforeStateChange", { key, val, previousVal });
                    {
                        pending && JFactoryExpect("beforeStateChange result", pending).type(JFactoryPromiseSync);
                    }

                    if (pending && !pending.$isSettled) {
                        states[key] = pending;
                        await pending;
                    }

                    if (val === undefined) {
                        delete states[key];
                    } else {
                        states[key] = val;
                    }

                    pending = notify && this.$notify("afterStateChange", { key, val, previousVal });
                    {
                        pending && JFactoryExpect("afterStateChange result", pending).type(JFactoryPromiseSync);
                    }
                }

                if (pending) {
                    pending.then(resolve);
                } else {
                    resolve();
                }
            });
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Service
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitService {

        trait_constructor() {
            /**
             * @name this.$.service
             * @type {object}
             */
            JFactoryObject.assign(this.$, "service", Object.create(null), JFactoryObject.descriptors.READONLY);
            this.$.service.phase = TraitService.PHASE.NONE;
            this.$.service.phaseQueue = JFactoryPromise.resolve({ name: "phaseQueue" }, null);
            this.$.service.phaseTask = null;
            this.$.service.phaseMap = {
                install: new Set(),
                enable: new Set(),
                disable: new Set(),
                uninstall: new Set()
            };

            // Set initial states but don't trigger events
            this.$state("installed", false, false);
            this.$state("enabled", false, false);

            // Define the events to notify before/after a state change
            // stateName : {before : eventName, after : eventName}

            // SPEC
            // stat is changed before calling handlers even if pending

            assignPrivateMember(this, "stateRoutes", {
                installed: { after: val => val ? "install" : "uninstall" },
                enabled: { after: val => val ? "enable"  : "disable" }
            }, JFactoryObject.descriptors.NONE);

            let custom = this.$[TraitCore.SYMBOL_PRIVATE].events.custom;
            let kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;

            // Attach a remove phase namespaces on events
            custom.affiliateAddRule((context, parsedEvent, namespaces, options) =>
                TraitService.setEventNamespaceRemovePhase(this, parsedEvent, options)
            );

            // Attach module event handlers

            /** @name JFactoryCoreObject#onInstall */
            /** @name JFactoryCoreObject#onEnable */
            /** @name JFactoryCoreObject#onDisable */
            /** @name JFactoryCoreObject#onUninstall */

            let phaseResolve = handler => {
                if (this.$.tasks.size) {
                    this.$taskRemoveAll(this.$.service.phase);
                }
                let promise = JFactoryPromiseSync.resolve();
                if (handler) {
                    promise = promise
                        .then(() => handler.call(this))
                        .then(() => this.$taskPromiseAll(true));
                }
                return promise
                    .catch(e => {
                        if (!(/*this.$.service.isPhaseKilling &&*/ e instanceof JFACTORY_ERR_PROMISE_EXPIRED)) {
                            this.$logErr("unhandled promise rejection in " + this.$.service.phase + ";",
                                ...e instanceof JFactoryError ? e : [e]);
                        }
                    });
            };

            kernel.on("install", () => phaseResolve(this.onInstall));
            kernel.on("enable", () => phaseResolve(this.onEnable));
            kernel.on("disable", () => phaseResolve(this.onDisable));
            kernel.on("uninstall", () => phaseResolve(this.onUninstall));

            kernel.on("disable",   () => this.$off({ removal: TraitService.PHASE.DISABLE }));
            kernel.on("uninstall", () => this.$off({ removal: TraitService.PHASE.UNINSTALL }));
        }

        $install(enable) {
            let resolve;
            const p = new JFactoryPromise(
                { name: "install", config: { chainAutoComplete: true } },
                _resolve => resolve = _resolve)
                .then(() => {
                    if (!this.$.states.installed) {
                        this.$.service.phase = TraitService.PHASE.INSTALL;
                        return this.$state("installed", true)
                    }
                });

            this.$.service.phaseMap.install.add(p);
            p.$chain.then(() => {
                this.$.service.phaseTask = null;
                this.$.service.phaseMap.install.delete(p);
                this.$.service.phase = TraitService.PHASE.NONE;
            });

            this.$.service.phaseQueue = this.$.service.phaseQueue.then(() => {
                this.$.service.phaseTask = p;
                resolve();
                return p.$chain
            });

            // register the enable
            if (enable) {return this.$enable()}
            return p
        }

        $enable() {
            let resolve;
            const p = new JFactoryPromise(
                { name: "enable", config: { chainAutoComplete: true } },
                _resolve => resolve = _resolve)
                .then(() => {
                    if (this.$.states.installed && !this.$.states.enabled) {
                        this.$.service.phase = TraitService.PHASE.ENABLE;
                        return this.$state("enabled", true)
                    }
                });

            this.$.service.phaseMap.enable.add(p);
            p.$chain.then(() => {
                this.$.service.phaseTask = null;
                this.$.service.phaseMap.enable.delete(p);
                this.$.service.phase = TraitService.PHASE.NONE;
            });

            this.$.service.phaseQueue = this.$.service.phaseQueue.then(() => {
                this.$.service.phaseTask = p;
                resolve();
                return p.$chain
            });
            return p
        }

        $disable() {
            let resolve;
            const p = new JFactoryPromise(
                { name: "disable", config: { chainAutoComplete: true } },
                _resolve => resolve = _resolve)
                .then(() => {
                    if (this.$.states.enabled) {
                        this.$.service.phase = TraitService.PHASE.DISABLE;
                        return this.$state("enabled", false)
                    }
                });

            this.$.service.phaseMap.disable.add(p);
            p.$chain.then(() => {
                this.$.service.phaseTask = null;
                this.$.service.phaseMap.disable.delete(p);
                this.$.service.phase = TraitService.PHASE.NONE;
            });

            // expires all stacked enable
            for (let [key, val] of this.$.service.phaseMap.enable.entries()) {
                if (val === this.$.service.phaseTask) {
                    TraitService.phaseKill(this);
                }
                val.$chainAbort();
                this.$.service.phaseMap.enable.delete(key);
            }

            this.$.service.phaseQueue = this.$.service.phaseQueue.then(() => {
                this.$.service.phaseTask = p;
                resolve();
                return p.$chain
            });
            return p
        }

        $uninstall() {
            let resolve;
            const p = new JFactoryPromise(
                { name: "uninstall", config: { chainAutoComplete: true } },
                _resolve => resolve = _resolve)
                .then(() => {
                    if (this.$.states.installed) {
                        this.$.service.phase = TraitService.PHASE.UNINSTALL;
                        return this.$state("installed", false)
                    }
                });

            this.$.service.phaseMap.uninstall.add(p);
            p.$chain.then(() => {
                this.$.service.phaseTask = null;
                this.$.service.phaseMap.uninstall.delete(p);
                this.$.service.phase = TraitService.PHASE.NONE;
            });

            // expires all stacked install
            for (let [key, val] of this.$.service.phaseMap.install.entries()) {
                if (val === this.$.service.phaseTask) {
                    TraitService.phaseKill(this);
                }
                val.$chainAbort();
                this.$.service.phaseMap.install.delete(key);
            }

            // queue disable before uninstall
            this.$disable();

            this.$.service.phaseQueue = this.$.service.phaseQueue.then(() => {
                this.$.service.phaseTask = p;
                resolve();
                return p.$chain
            });
            return p
        }

        static phaseKill(component) {
            // component.$.service.isPhaseKilling = true;
            if (component.$.tasks.size) {
                component.$taskRemoveAll(TraitService.getContextualRemovePhase(component));
            }
            component.$.service.phase = TraitService.PHASE.NONE;
        }

        static getContextualRemovePhase(jFactoryCoreObject) {
            return TraitService.PHASE_REVERT[jFactoryCoreObject.$.service.phase]
        }

        static setEventNamespaceRemovePhase(jFactoryCoreObject, parsedEvent, options) {
            let curRemovePhase = parsedEvent.hasNamespace(TraitService.PHASES);
            let newRemovePhase = options && options.removal;

            if (!newRemovePhase) {
                newRemovePhase = TraitService.getContextualRemovePhase(jFactoryCoreObject);
            }

            // special case : on("uninstall") with removal = DISABLE (the default value)
            // => disable() is always called before uninstall() causing the event to be removed too early
            if (parsedEvent.event === "uninstall" && newRemovePhase === TraitService.PHASE.DISABLE) {
                newRemovePhase = TraitService.PHASE.UNINSTALL;
            }

            if (curRemovePhase !== newRemovePhase) {
                parsedEvent.deleteNamespace(curRemovePhase);
                parsedEvent.addNamespace(newRemovePhase);
            }

            parsedEvent.addNamespace(newRemovePhase);
        }
    }

    TraitService.PHASE = {
        NONE: "PHASE_NONE",
        INSTALL: "PHASE_INSTALL",
        ENABLE: "PHASE_ENABLE",
        DISABLE: "PHASE_DISABLE",
        UNINSTALL: "PHASE_UNINSTALL"
    };

    TraitService.PHASE_REVERT = {
        [TraitService.PHASE.INSTALL]: TraitService.PHASE.UNINSTALL,
        [TraitService.PHASE.UNINSTALL]: TraitService.PHASE.INSTALL,
        [TraitService.PHASE.DISABLE]: TraitService.PHASE.ENABLE,
        [TraitService.PHASE.ENABLE]: TraitService.PHASE.DISABLE,
        [TraitService.PHASE.NONE]: TraitService.PHASE.DISABLE
    };

    TraitService.PHASES = Object.values(TraitService.PHASE);

    // -----------------------------------------------------------------------------------------------------------------

    function assignPrivate(scope, property, value, descriptor) {
        JFactoryObject.assign(scope.$[TraitCore.SYMBOL_PRIVATE], property, value, descriptor);
    }

    function assignPrivateMember(scope, property, value, descriptor) {
        JFactoryObject.assign(scope.$[TraitCore.SYMBOL_PRIVATE][property], value, descriptor);
    }

    jFactory.PHASE = JFactoryObject.disinherit(TraitService.PHASE);

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryFetch
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    class JFactoryFetch extends JFactoryPromise {

        constructor(optionalArgs, url, fetchOptions = {}) {
            if (typeof optionalArgs === "function") {
                super(optionalArgs);
            } else {
                if (typeof optionalArgs === "string") {
                    [optionalArgs, url, fetchOptions] = [{}, arguments[0], arguments[1]];
                }

                let fetchRequest = new Request(url, fetchOptions);

                super(optionalArgs, (resolve, reject) => {
                    let promise = fetch(fetchRequest)
                        .then(response => {
                            this.$chain.fetchResponse = response;
                            if (!response.ok) {
                                throw Error(response.status + ":" + response.statusText);
                            }
                            return response
                        });

                    if (fetchOptions.$typeText) {
                        promise = promise
                            .then(response => response.text())
                            .then(r => this.$chain.responseText = r);
                    }
                    else if (fetchOptions.$typeJSON) {
                        promise = promise
                            .then(response => response.json())
                            .then(r => this.$chain.responseJSON = r);
                    }

                    promise = promise.catch(reason => {
                        throw new JFACTORY_ERR_REQUEST_ERROR({
                            reason: reason.message || reason,
                            target: this.$chain.fetchResponse && this.$chain.fetchResponse.url || url,
                            owner: this,
                            fetchOptions,
                            fetchRequest,
                            fetchResponse: this.$chain.fetchResponse || null
                        }, optionalArgs.traceSource)
                    });

                    promise.then(resolve, reject);
                });

                this.$chain.fetchOptions = fetchOptions;
                this.$chain.fetchRequest = fetchRequest;

                let abortCtrl = fetchOptions.abortController || new AbortController();
                fetchOptions.signal = abortCtrl.signal;
                this.$chain.fetchAbortController = abortCtrl;
            }
        }

        $chainAbort(reason = "request aborted") {
            super.$chainAbort(reason);
            this.$chain.fetchAbortController.abort();
            return this
        }
    }

    jFactoryCompat_require(
        JFACTORY_COMPAT_fetch,
        JFACTORY_COMPAT_Request,
        JFACTORY_COMPAT_AbortController
    );

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * -----------------------------------------------------------------------------------------------------------------
     * TraitComponents
     * -----------------------------------------------------------------------------------------------------------------
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Fetch
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitFetch {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$fetchRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$fetchRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("requests", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $fetch(id, url, fetchOptions = {}) {
            id = this.$.requests.$id_resolve(id);

            {
                JFactoryExpect("$fetch(id)", id).typeString();
                JFactoryExpect("$fetch(url)", url).typeString();
                JFactoryExpect("$fetch(fetchOptions)", fetchOptions).typePlainObject();
                if (this.$.requests.has(id)) {
                    throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$fetch(id)", given: id })
                }
            }

            let promise = new JFactoryFetch({
                name: id,
                traceSource: jFactoryTrace.captureTraceSource("$fetch"),
                config: {
                    chainAutoComplete: true
                }
            }, url, fetchOptions);

            this.$.requests.$registerAsync(id, '$fetch("' + id + '")', promise);

            promise.$chain.then(() => {
                if (this.$.requests.has(id)) {
                    this.$fetchRemove(id);
                }
            });

            return promise;
        }

        $fetchText(id, url, fetchOptions = {}) {
            return this.$fetch(id, url, { ...fetchOptions, $typeText: true });
        }

        $fetchJSON(id, url, fetchOptions = {}) {
            return this.$fetch(id, url, { ...fetchOptions, $typeJSON: true });
        }

        $fetchRemove(id, reason) {
            {
                JFactoryExpect("$fetchRemove(id)", id).typeString();
                reason && JFactoryExpect("$fetchRemove(reason)", reason).typeString();
                if (!this.$.requests.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$fetchRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.requests.get(id)._debug_remove_called) {debugger}
                this.$.requests.get(id)._debug_remove_called = true;
            }

            let entry = this.$.requests.get(id);
            this.$.requests.delete(id);
            entry.$chainAbort(reason || "$fetchRemove()");
        }

        $fetchRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.requests;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$fetchRemove(key, "$fetchRemoveAll(" + removePhase + ")");
                    }
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Timeout
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitTimeout {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$timeoutRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$timeoutRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("timeouts", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $timeout(id, delay, handler = null, ...args) {
            // id
            // id, delay
            // id, delay, handler, ...args

            id = this.$.timeouts.$id_resolve(id);

            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("delay", delay).typeNumber();
                JFactoryExpect("handler", handler).type(Function, null);
                if (this.$.timeouts.has(id)) {
                    throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$timeout(id)", given: id })
                }
            }

            let timer;
            let promise = new JFactoryPromise(
                {
                    name: id,
                    traceSource: jFactoryTrace.captureTraceSource("$timeout"),
                    config: {
                        chainAutoComplete: true
                    }
                },
                resolve => {
                    timer = setTimeout(() => {
                        if (!promise.$isExpired) {
                            resolve(handler ? handler(...args) : undefined);
                        }
                    }, delay);
                }
            );

            promise.$chain.data.timer = timer;
            this.$.timeouts.$registerAsync(id, '$timeout("' + id + '")', promise);

            promise.$chain.then(() => {
                if (this.$.timeouts.has(id)) {
                    this.$timeoutRemove(id);
                }
            });

            return promise;
        }

        $timeoutRemove(id, reason) {
            {
                JFactoryExpect("$timeoutRemove(id)", id).typeString();
                reason && JFactoryExpect("$timeoutRemove(reason)", reason).typeString();
                if (!this.$.timeouts.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$timeoutRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.timeouts.get(id)._debug_remove_called) {debugger}
                this.$.timeouts.get(id)._debug_remove_called = true;
            }

            let entry = this.$.timeouts.get(id);
            clearTimeout(entry.$chain.data.timer);
            // deleting before chainAbort() to prevent remove() recall
            this.$.timeouts.delete(id);
            entry.$chainAbort(reason || "$timeoutRemove()");
        }

        $timeoutRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.timeouts;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$timeoutRemove(key, "$timeoutRemoveAll()");
                    }
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Interval
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitInterval {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$intervalRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$intervalRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("timeints", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $interval(id, delay, handler, ...args) {
            id = this.$.timeints.$id_resolve(id);
            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("handler", handler).typeFunction();
                JFactoryExpect("delay", delay).typeNumber();
                if (this.$.timeints.has(id)) {
                    throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$interval(id)", given: id })
                }
            }
            let timer = setInterval(handler, delay, ...args);
            this.$.timeints.$registerSync(id, timer);
        }

        $intervalRemove(id) {
            {
                JFactoryExpect("$intervalRemove(id)", id).typeString();
                if (!this.$.timeints.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$intervalRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.timeints.get(id)._debug_remove_called) {debugger}
                this.$.timeints.get(id)._debug_remove_called = true;
            }
            clearInterval(this.$.timeints.get(id).$value);
            this.$.timeints.delete(id);
        }

        $intervalRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.timeints;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$intervalRemove(key);
                    }
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait Mutations
     * -----------------------------------------------------------------------------------------------------------------
     */

    {
        jFactoryCompat_require(JFACTORY_COMPAT_MutationObserver);
    }

    class TraitMutation {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$mutationRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$mutationRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("mutations", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $mutation(id, parent, config, handler) {
            id = this.$.mutations.$id_resolve(id);
            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("parent", parent).type(HTMLElement, Document);
                JFactoryExpect("config", config).typePlainObject();
                JFactoryExpect("handler", handler).typeFunction();
                if (this.$.mutations.has(id)) {
                    throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$mutation(id)", given: id })
                }
            }
            let observer = new MutationObserver(handler);
            observer.observe(parent, config);
            this.$.mutations.$registerSync(id, observer);
        }

        $mutationRemove(id, reason) {
            {
                JFactoryExpect("$mutationRemove(id)", id).typeString();
                reason && JFactoryExpect("$mutationRemove(reason)", reason).typeString();
                if (!this.$.mutations.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$mutationRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.mutations.get(id)._debug_remove_called) {debugger}
                this.$.mutations.get(id)._debug_remove_called = true;
            }
            this.$.mutations.get(id).$value.disconnect();
            this.$.mutations.delete(id);
        }

        $mutationRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.mutations;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$mutationRemove(key);
                    }
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait DOM
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitDOM {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$domRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$domRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("dom", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $dom(id, jQueryArgument, appendTo) {
            id = this.$.dom.$id_resolve(id);

            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("jQueryArgument", jQueryArgument).type(String, Object);
                appendTo && JFactoryExpect("appendTo", appendTo).type(String, Object);
            }

            let domId;
            if (id[0] === "#") {
                id = id.substring(1);
                domId = true;
            }

            if (this.$.dom.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$dom(id)", given: id })
            }

            let dom = jQuery(jQueryArgument);

            if (dom[0].tagName === "TEMPLATE") {
                dom = jQuery(jQuery(dom[0]).html());
            }

            if (domId) {
                {
                    if (dom[0].nodeType !== Node.ELEMENT_NODE) {
                        throw new JFACTORY_ERR_INVALID_VALUE({
                            target: "$dom(#id)",
                            given: dom,
                            reason: "cannot set the dom id: the first element of the selection isn't an ELEMENT_NODE"
                        })
                    }
                }
                dom[0].id = id;
            }

            if (appendTo) {
                dom.appendTo(appendTo);
            }

            return this.$.dom.$registerSync(id, dom).$value;
        }

        $domFetch(id, url, fetchOptions, appendTo) {
            if (fetchOptions && !helper_isPlainObject(fetchOptions)) {
                [fetchOptions, appendTo] = [{}, fetchOptions];
            }

            id = this.$.dom.$id_resolve(id);

            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("url", url).typeString();
                appendTo && JFactoryExpect("appendTo", appendTo).type(String, Object);
                fetchOptions && JFactoryExpect("fetchOptions", fetchOptions).type(Object);
            }

            let domId;
            if (id[0] === "#") {
                id = id.substring(1);
                domId = true;
            }

            if (this.$.dom.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$domFetch(id)", given: id })
            }

            let promise = this.$fetchText('$domFetch("' + id + '")', url, fetchOptions)
                .then(r => {
                    let dom = jQuery(r);
                    if (domId) {
                        dom[0].id = id;
                    }
                    if (appendTo) {
                        dom.appendTo(appendTo);
                    }
                    return dom
                });

            this.$.dom.$registerAsync(id, '$domFetch("' + id + '")', promise);
            return promise
        }

        $domRemove(id, reason) {
            {
                JFactoryExpect("$domRemove(id)", id).typeString();
                reason && JFactoryExpect("$domRemove(reason)", reason).typeString();
                if (!this.$.dom.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$domRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.dom.get(id)._debug_remove_called) {debugger}
                this.$.dom.get(id)._debug_remove_called = true;
            }

            let entry = this.$.dom.get(id);
            let value = entry.$value;
            if (value instanceof jQuery) {
                value.remove();
            }
            if (entry instanceof JFactoryFetch) {
                entry.$chainAbort(reason || "$domRemove()");
            }
            this.$.dom.delete(id);
        }

        $domRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.dom;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$domRemove(key);
                    }
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * Trait CSS
     * -----------------------------------------------------------------------------------------------------------------
     */

    class TraitCSS {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$cssRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$cssRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("css", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $css(id, styleBody) {
            id = this.$.css.$id_resolve(id);

            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("css", styleBody).typeString();
            }

            let cssId;
            if (id[0] === "#") {
                id = id.substring(1);
                cssId = true;
            }

            if (this.$.css.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$css(id)", given: id })
            }

            return this.$.css.$registerSync(id,
                jQuery("<style>")
                    .attr(cssId ? { id } : {})
                    .html(styleBody)
                    .appendTo("head")
            ).$value;
        }

        $cssFetch(id, url, appendTo = "head") {
            id = this.$.css.$id_resolve(id);

            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("url", url).typeString();
            }

            let cssId;
            if (id[0] === "#") {
                id = id.substring(1);
                cssId = true;
            }

            if (this.$.css.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$cssFetch(id)", given: id })
            }

            url = helper_url_abs(url);

            let exist = jQuery(appendTo).find(`link[href="${url}"]`)[0];
            if (exist) {
                exist.dataset.usage = parseInt(exist.dataset.usage) + 1;
                let dom = jQuery(exist);

                let promise = JFactoryPromise.resolve(
                    {
                        name: id,
                        config: { chainAutoComplete: true },
                        traceSource: jFactoryTrace.captureTraceSource("$cssFetch")
                    },
                    dom
                );
                promise.$chain.data.dom = dom;
                this.$.css.$registerAsync(id, '$cssFetch("' + id + '")', promise);

                return promise
            } else {
                let dom;
                let promise = new JFactoryPromise(
                    {
                        name: id,
                        config: { chainAutoComplete: true },
                        traceSource: jFactoryTrace.captureTraceSource("$cssFetch")
                    },
                    resolve => dom = jQuery("<link>",
                        { id: cssId ? id : "", rel: "stylesheet", type: "text/css", "data-usage": "1" })
                        .appendTo(appendTo)
                        .on("load", () => resolve(dom))
                        .attr("href", url)
                );

                promise.$chain.data.dom = dom;
                this.$.css.$registerAsync(id, '$cssFetch("' + id + '")', promise);
                return promise
            }
        }

        $cssRemove(id, reason) {
            {
                JFactoryExpect("$cssRemove(id)", id).typeString();
                reason && JFactoryExpect("$cssRemove(reason)", reason).typeString();
                if (!this.$.css.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$cssRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.css.get(id)._debug_remove_called) {debugger}
                this.$.css.get(id)._debug_remove_called = true;
            }

            let entry = this.$.css.get(id);
            let value = entry.$chain && entry.$chain.data.dom || entry.$value;
            if (value instanceof jQuery) {
                let usage = parseInt(value[0].dataset.usage) - 1;
                if (usage) {
                    value[0].dataset.usage = usage;
                } else {
                    value.remove();
                }
            }
            if (entry instanceof JFactoryPromise) {
                entry.$chainAbort(reason || "$cssRemove()");
            }
            this.$.css.delete(id);
        }

        $cssRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.css;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$cssRemove(key);
                    }
                }
            }
        }
    }

    class TraitLibVue {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$vueRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$vueRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("vue", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $vue(id, vue) {
            id = this.$.vue.$id_resolve(id);

            {
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("vue", vue).type(Object);
            }

            if (this.$.vue.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$vue(id)", given: id })
            }

            return this.$.vue.$registerSync(id, vue).$value;
        }

        $vueRemove(id) {
            {
                JFactoryExpect("$vueRemove(id)", id).typeString();
                if (!this.$.vue.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$vueRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.vue.get(id)._debug_remove_called) {debugger}
                this.$.vue.get(id)._debug_remove_called = true;
            }

            let entry = this.$.vue.get(id);
            jQuery(entry.$value.$el).remove();
            entry.$value.$destroy();
            this.$.vue.delete(id);
        }

        $vueRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.vue;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$vueRemove(key);
                    }
                }
            }
        }
    }

    class TraitLibReact {
        trait_constructor() {
            const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
            kernel.on("disable", () => this.$reactRemoveAll(TraitService.PHASE.DISABLE));
            kernel.on("uninstall", () => this.$reactRemoveAll(TraitService.PHASE.UNINSTALL));
            this.$.assign("react", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
        }

        $react(id, container, element, ...renderOtherArguments) {
            id = this.$.react.$id_resolve(id);

            {
                if (!jFactory.ReactDOM) {
                    throw new Error("jFactory.ReactDOM=ReactDOM must be set before using the React Trait");
                }
                JFactoryExpect("id", id).typeString();
                JFactoryExpect("container", container).type(HTMLElement, jQuery);
            }

            if (this.$.react.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$react(id)", given: id })
            }

            container = jQuery(container)[0];
            let view = jFactory.ReactDOM.render(element, container, ...renderOtherArguments);
            return this.$.react.$registerSync(id, { container, view }).$value.view;
        }

        $reactRemove(id) {
            {
                JFactoryExpect("$reactRemove(id)", id).typeString();
                if (!this.$.react.has(id)) {
                    throw new JFACTORY_ERR_KEY_MISSING({
                        target: "$reactRemove(id)",
                        given: id
                    })
                }
                // eslint-disable-next-line no-debugger,brace-style
                if (this.$.react.get(id)._debug_remove_called) {debugger}
                this.$.react.get(id)._debug_remove_called = true;
            }

            let value = this.$.react.get(id).$value;
            let el = value.container;
            if (el) {
                if (!jFactory.ReactDOM.unmountComponentAtNode(el)) {
                    {
                        this.$logWarn("unmountComponentAtNode failed to unmount", el);
                    }
                }
                jQuery(el).remove();
            }
            this.$.react.delete(id);
        }

        $reactRemoveAll(removePhase) {
            {
                JFactoryExpect("removePhase", removePhase)
                    .equalIn(TraitService.PHASES);
            }
            let subs = this.$.react;
            if (subs.size) {
                for (const [key, sub] of subs) {
                    if (sub.$phaseRemove === removePhase) {
                        this.$reactRemove(key);
                    }
                }
            }
        }
    }

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * JFactoryComponents
     * -----------------------------------------------------------------------------------------------------------------
     * Status: Beta
     * -----------------------------------------------------------------------------------------------------------------
     */

    /**
     * @mixes TraitCore
     * @mixes TraitAbout
     * @mixes TraitLog
     * @mixes TraitEvents
     * @mixes TraitState
     * @mixes TraitService
     * @mixes TraitTask
     */
    class JFactoryCoreObject {
        constructor(name) {
            JFactoryCoreObject.inject(this, JFactoryCoreObject, name);
        }

        static inject(target, constructor, name) {
            jFactoryTraits(target, constructor)
                .use(TraitCore)
                .use(TraitAbout, { name })
                .use(TraitLog)
                .use(TraitEvents)
                .use(TraitState)
                .use(TraitService)
                .use(TraitTask);
        }
    }

    /**
     * @mixes TraitFetch
     * @mixes TraitDOM
     * @mixes TraitCSS
     * @mixes TraitMutation
     * @mixes TraitTimeout
     * @mixes TraitInterval
     * @mixes TraitLibVue
     * @mixes TraitLibReact
     */
    class JFactoryComponent extends JFactoryCoreObject {
        constructor(name) {
            super(name);
            JFactoryComponent.inject(this, JFactoryComponent);
        }

        static inject(target, constructor) {
            jFactoryTraits(target, constructor)
            .use(TraitFetch)
            .use(TraitDOM)
            .use(TraitCSS)
            .use(TraitMutation)
            .use(TraitTimeout)
            .use(TraitInterval)
            .use(TraitLibVue)
            .use(TraitLibReact);
        }
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Config jFactory baseComponent
    // -----------------------------------------------------------------------------------------------------------------

    jFactoryCfg('jFactory', { baseComponent: JFactoryComponent });

    /**
     * -----------------------------------------------------------------------------------------------------------------
     * jFactory entry file (see package.json scripts to compile)
     * -----------------------------------------------------------------------------------------------------------------
     * The ES version is exported as separated modules to benefit from module Tree Shaking
     * -----------------------------------------------------------------------------------------------------------------
     */

    jFactoryBootstrap(true);

    exports.helper_get = helper_get;
    exports.helper_lowerFirst = helper_lowerFirst;
    exports.helper_template = helper_template;
    exports.helper_isString = helper_isString;
    exports.helper_isNumber = helper_isNumber;
    exports.helper_isPlainObject = helper_isPlainObject;
    exports.helper_camelCase = helper_camelCase;
    exports.helper_defaultsDeep = helper_defaultsDeep;
    exports.jQuery = jQuery;
    exports.JFACTORY_BOOT = JFACTORY_BOOT;
    exports.JFACTORY_CLI = JFACTORY_CLI;
    exports.JFACTORY_DEV = JFACTORY_DEV;
    exports.JFACTORY_ERR_INVALID_CALL = JFACTORY_ERR_INVALID_CALL;
    exports.JFACTORY_ERR_INVALID_VALUE = JFACTORY_ERR_INVALID_VALUE;
    exports.JFACTORY_ERR_KEY_DUPLICATED = JFACTORY_ERR_KEY_DUPLICATED;
    exports.JFACTORY_ERR_KEY_MISSING = JFACTORY_ERR_KEY_MISSING;
    exports.JFACTORY_ERR_PROMISE_EXPIRED = JFACTORY_ERR_PROMISE_EXPIRED;
    exports.JFACTORY_ERR_REQUEST_ERROR = JFACTORY_ERR_REQUEST_ERROR;
    exports.JFACTORY_LOG = JFACTORY_LOG;
    exports.JFACTORY_NAME = JFACTORY_NAME;
    exports.JFACTORY_REPL = JFACTORY_REPL;
    exports.JFACTORY_TRACE = JFACTORY_TRACE;
    exports.JFACTORY_VER = JFACTORY_VER;
    exports.JFactoryAbout = JFactoryAbout;
    exports.JFactoryComponent = JFactoryComponent;
    exports.JFactoryCoreObject = JFactoryCoreObject;
    exports.JFactoryError = JFactoryError;
    exports.JFactoryEventSelector = JFactoryEventSelector;
    exports.JFactoryEventSelectorParser = JFactoryEventSelectorParser;
    exports.JFactoryEvents = JFactoryEvents;
    exports.JFactoryEventsManager = JFactoryEventsManager;
    exports.JFactoryExpect = JFactoryExpect;
    exports.JFactoryFetch = JFactoryFetch;
    exports.JFactoryFunctionComposer = JFactoryFunctionComposer;
    exports.JFactoryFunctionConditional = JFactoryFunctionConditional;
    exports.JFactoryFunctionExpirable = JFactoryFunctionExpirable;
    exports.JFactoryFunctionWrappable = JFactoryFunctionWrappable;
    exports.JFactoryLogger = JFactoryLogger;
    exports.JFactoryObject = JFactoryObject;
    exports.JFactoryPromise = JFactoryPromise;
    exports.JFactoryPromiseChain = JFactoryPromiseChain;
    exports.JFactoryPromisePath = JFactoryPromisePath;
    exports.JFactoryPromiseSync = JFactoryPromiseSync;
    exports.JFactoryTime = JFactoryTime;
    exports.JFactoryTimeTrace = JFactoryTimeTrace;
    exports.JFactoryTrace = JFactoryTrace;
    exports.JFactoryTrace_LIB_STACKTRACE = JFactoryTrace_LIB_STACKTRACE;
    exports.JFactoryTraits = JFactoryTraits;
    exports.NOOP = NOOP;
    exports.helper_deferred = helper_deferred;
    exports.helper_isNative = helper_isNative;
    exports.helper_setFunctionName = helper_setFunctionName;
    exports.helper_url_abs = helper_url_abs;
    exports.helper_useragent = helper_useragent;
    exports.jFactory = jFactory;
    exports.jFactoryCfg = jFactoryCfg;
    exports.jFactoryFunctionConditional = jFactoryFunctionConditional;
    exports.jFactoryFunctionExpirable = jFactoryFunctionExpirable;
    exports.jFactoryFunctionWrappable = jFactoryFunctionWrappable;
    exports.jFactoryTrace = jFactoryTrace;

    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

}));
