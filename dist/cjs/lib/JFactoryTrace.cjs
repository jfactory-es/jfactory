'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryHelpers = require('../jFactory-helpers.cjs');
const jFactoryConfig = require('../jFactory-config.cjs');

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

        h(StackTrace.getSync(this.source, CONFIG.libOptions));
        if (CONFIG.useSourcemap) {
            this.asyncPrintable = StackTrace.fromError(this.source, CONFIG.libOptions).then(h);
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
{

    tracer = {
        captureTraceSource: jFactoryHelpers.NOOP,
        attachTrace: jFactoryHelpers.NOOP
    };

}

const jFactoryTrace = tracer;

// -----------------------------------------------------------------------------------------------------------------
// Config JFactoryTrace
// -----------------------------------------------------------------------------------------------------------------

const CONFIG = /*#__PURE__*/jFactoryConfig.jFactoryCfg("JFactoryTrace");

exports.JFactoryTrace = JFactoryTrace;
exports.JFactoryTrace_LIB_STACKTRACE = JFactoryTrace_LIB_STACKTRACE;
exports.jFactoryTrace = jFactoryTrace;
