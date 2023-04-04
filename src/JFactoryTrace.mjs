import { JFACTORY_DEV } from "./jFactory-env.mjs";
import { JFACTORY_TRACE } from "./jFactory-env.mjs";
import { NOOP, helper_useragent } from "./jFactory-helpers.mjs";
import { jFactoryCfg } from "./jFactory-env.mjs";
import { jFactoryBootstrap_onBoot } from "./jFactory-bootstrap.mjs";

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTrace 1.7
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta, HasSideEffects
// ---------------------------------------------------------------------------------------------------------------------
// - #limitation# Error.stack is not standardized
// - #limitation# Error.stack is not source-mapped
// - #limitation# bug https://bugzilla.mozilla.org/show_bug.cgi?id=1584244
// - #limitation# StackTrace.js resolves sourcemaps. Unfortunately, it doesn't work with "webpack:" protocol
//   see https://github.com/stacktracejs/stacktrace.js/issues/209
// ---------------------------------------------------------------------------------------------------------------------
// https://github.com/mozilla/source-map/
// https://www.stacktracejs.com/
// https://github.com/novocaine/sourcemapped-stacktrace
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryTrace {

    constructor(omitAboveFunctionName = "JFactoryTrace", omitSelf = true, stackTraceLimit = Infinity) {
        let _stackTraceLimit;
        if (stackTraceLimit) {
            _stackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = stackTraceLimit
        }

        this.source = new Error();
        this.omitAboveFunctionName = omitAboveFunctionName;
        this.omitSelf = omitSelf;

        if (stackTraceLimit) {
            Error.stackTraceLimit = _stackTraceLimit
        }

        this.init()
    }

    init() {
        this.printable = this.source;
        this.asyncPrintable = Promise.resolve(this.printable)
    }

    static createErrorFromStack(stack) {
        let e = new Error();
        e.name = "JFactoryTrace";
        e.stack = stack;
        return e
    }
}

export class JFactoryTrace_LIB_STACKTRACE extends JFactoryTrace {

    init() {
        let h = traceFrames => {
            this.printable = this.constructor.createErrorFromStack(
                this.createStackFromTraceFrames(
                    this.filterTraceFrames(traceFrames)
                )
            )
        }

        h(StackTrace.getSync(this.source, config.libOptions));
        if (config.useSourcemap) {
            this.asyncPrintable = StackTrace.fromError(this.source, config.libOptions).then(h)
        } else {
            this.asyncPrintable = Promise.resolve(this.printable)
        }
    }

    filterTraceFrames(traceFrames) {
        if (this.omitAboveFunctionName) {
            let slice = traceFrames.findIndex(
                value => value.functionName && value.functionName.endsWith(this.omitAboveFunctionName)
            );
            if (slice > 0) {
                if (this.omitSelf) {
                    slice++
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

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryTrace
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

let tracer;
if (JFACTORY_DEV && JFACTORY_TRACE) {

    tracer = {

        captureTraceSource(omitAboveFunctionName, omitSelf, stackTraceLimit) {
            return new(config.tracer || JFactoryTrace)(omitAboveFunctionName, omitSelf, stackTraceLimit)
        },

        attachTrace(
            targetObject, traceSource /* or omitAboveFunctionName */,
            traceLogKey = config.keys[0], traceSourceKey = config.keys[1],
            label = config.label
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
                                s += sf.functionName + " (" + uri + ")"
                            } else {
                                s += uri // no parenthesis
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
    }

} else {

    tracer = {
        captureTraceSource: NOOP,
        attachTrace: NOOP
    };

}

export const jFactoryTrace = tracer;

// ---------------------------------------------------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------------------------------------------------

const config = jFactoryCfg("JFACTORY_CFG_JFactoryTrace");

if (JFACTORY_DEV && JFACTORY_TRACE) {
    config.keys = ["$dev_traceLog", "$dev_traceSource"];
    if (typeof StackTrace === "object") {
        config.tracer = JFactoryTrace_LIB_STACKTRACE;
        config.useSourcemap = false;
    }
    jFactoryBootstrap_onBoot(function() {
        if (config.tracer === JFactoryTrace_LIB_STACKTRACE) {
            console.log("JFactoryTrace: Stacktrace.js support enabled; performances will be affected")
        }
    })
}