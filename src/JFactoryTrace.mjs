/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_CFG_JFactoryTrace } from "./jFactory-env";
import { jFactoryLoader_onInit } from "./jFactoryLoader";
import { NOOP } from "./jFactory-helpers";

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryTrace
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
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

export class JFactoryTrace_NOFILTER {

    constructor({ label, stackTraceLimit, keys, libOptions } = {}) {
        this.label = label || "The stack has been printed in the console";
        this.stackTraceLimit = stackTraceLimit || Infinity;
        this.keys = keys || ["stackLog", "stackSource"];
        this.libOptions = libOptions || {}
    }

    captureTraceSource(omitAboveFunctionName, omitSelf) {
        let _stackTraceLimit;
        if (this.stackTraceLimit) {
            _stackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = this.stackTraceLimit
        }
        if (!omitAboveFunctionName) {
            omitAboveFunctionName = "captureTraceSource";
            omitSelf = true
        }
        let traceSource = {
            source: new Error(),
            omitAboveFunctionName,
            omitSelf
        };
        if (this.stackTraceLimit) {
            Error.stackTraceLimit = _stackTraceLimit
        }
        return traceSource
    }

    attachTrace(targetObject, traceSource) {
        if (typeof traceSource !== "object") {
            traceSource = this.captureTraceSource(traceSource || "attachTrace", !traceSource);
        }

        let trace = traceSource.source;
        this.toPrintableTrace(traceSource)
            .then(r => trace = r);

        let log = () => console.log(trace) || this.label;

        Object.defineProperty(targetObject, this.keys[0] /* traceLog */, {
            enumerable: false,
            configurable: true,
            // hide the function body to improve readability in devtool
            get: () => log()
        });
        Object.defineProperty(targetObject, this.keys[1] /* traceSource */, {
            enumerable: false,
            configurable: true,
            // hide the traceSource Error to improve readability in devtool, specially in Firefox
            get: () => traceSource
        });
    }

    toPrintableTrace(traceSource) {
        // SPEC: this overridable method returns a promise
        // because stacktrace parsers may be asynchronous
        return Promise.resolve(traceSource.source)
    }
}

export class JFactoryTrace_LIB_STACKTRACE extends JFactoryTrace_NOFILTER {

    constructor(config) {
        super(config);
    }

    toPrintableTrace(traceSource) {
        return StackTrace.fromError(traceSource.source, this.libOptions)
            .then(traceFrames => {

                if (traceSource.omitAboveFunctionName) {
                    let slice = traceFrames.findIndex(
                        value => {
                            return value.functionName && value.functionName.endsWith(traceSource.omitAboveFunctionName)
                        }
                    );
                    if (slice > 0) {
                        if (traceSource.omitSelf) {
                            slice++
                        }
                        traceFrames = traceFrames.slice(slice);
                    }
                }
                traceFrames = traceFrames
                    .filter(this.libOptions.filter);
                return this.formatTraceFrames(traceFrames)
            });
    }

    formatTraceFrames(traceFrames) {
        let header;
        let linePrefix;
        if (this.libOptions.offline && window.chrome) {
            // if the fallowing syntax is detected on Chrome,
            // the console.log() will convert the fileNames using sourcemaps
            header = "Error\n"; // notes that anything after "Error" is valid
            linePrefix = "\tat ";
        } else {
            header = "";
            linePrefix = "";
        }
        return header +
            traceFrames
                .map(sf => linePrefix + sf.toString())
                .join("\n");
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryTrace
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export const jFactoryTrace = {};

jFactoryLoader_onInit(function() {
    let config = JFACTORY_CFG_JFactoryTrace;
    if (config && config.use !== false) {
        let constructor;
        constructor = typeof config.use === "function" ?
            config.use :
            typeof StackTrace === "object" ? JFactoryTrace_LIB_STACKTRACE : JFactoryTrace_NOFILTER;
        if (constructor === JFactoryTrace_LIB_STACKTRACE) {
            console.warn("jFactory: Stack trace enabled; Performance will be affected")
        }
        jFactoryTrace.tracer = new constructor(config);
    } else {
        jFactoryTrace.tracer = {
            captureTraceSource: NOOP,
            attachTrace: NOOP
        };
    }
});