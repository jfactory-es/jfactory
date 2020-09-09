/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_DEV } from "./jFactory-env";
import { JFACTORY_ERR_INVALID_CALL, JFACTORY_ERR_PROMISE_EXPIRED } from "./JFactoryError";
import { JFactoryExpect } from "./JFactoryExpect";
import { jFactoryTrace } from "./JFactoryTrace";
import { helper_isNative, jQuery } from "./jFactory-helpers";
import {
    JFACTORY_COMPAT_AbortController,
    JFACTORY_COMPAT_fetch,
    JFACTORY_COMPAT_Request,
    jFactoryCompat_require
} from "./jFactoryCompat";

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryPromise
// ---------------------------------------------------------------------------------------------------------------------
// Provides awaitable, expirable, debuggable promise chains
// ---------------------------------------------------------------------------------------------------------------------
// Status: Experimental Draft
// ---------------------------------------------------------------------------------------------------------------------

// #limitation# async functions always use the native Promise constructor even if native Promise class is overridden
// #limitation# async functions always returns a native Promise even if returning an extended Promise
// #limitation# async functions always returns a pending Promise even if returning a resolved Promise

const moduleGenId = () => ++moduleGenId.uid; moduleGenId.uid = 0;

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryPromise
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryPromise extends Promise {

    constructor({ name, config, traceSource }, executor) {

        if (arguments.length === 1) {
            [name, config, executor] = [null, null, arguments[0]]
        }

        const chainId = moduleGenId();
        config = { ...JFactoryPromise.DEFAULT_CONFIG, ...config };
        name = name || "unnamed";

        if (JFACTORY_DEV) {
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

        if (JFACTORY_DEV) {
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
            jFactoryTrace.tracer.attachTrace(this, traceSource);
        }

        const tryAutoComplete = () => {
            if (!this.$chain.isPending) {
                try {
                    this.$chainComplete("auto-completed");
                } catch (e) {
                    // Case of error in "complete" callback
                    // We catch the exception because the promise is already fulfilled
                    // Furthermore this issue must be handled by the chain, not the current promise
                    console.error(e) // print the error otherwise nothing happens
                }
            }
        };

        const onResolve = value => {
            // console.log('onResolve',this.$dev_name);
            if (!this.$isSettled) {
                // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
                if (value === this) {
                    onReject(new TypeError("Chaining cycle detected for promise " + this.$dev_name));
                    return;
                }

                let then;
                if (value !== null && (typeof value == "object" || typeof x == "function")) {
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
                    onSettle(value)
                }
            }
        };

        const onReject = reason => {
            // console.log('onReject',this.$dev_name);
            if (!this.$isSettled) {
                this.$isRejected = true;
                this.$isFulfilled = false;
                reject(reason);
                onSettle(reason)
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
                    this.then(tryAutoComplete)
                } else {
                    tryAutoComplete()
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
                        tryAutoComplete()
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
            onReject(e)
        }
    }

    then(onFulfilled, onRejected, forceType) {
        let wrappedFulfilled;
        let wrappedRejected;
        let newPromise;
        let isNative = helper_isNative(onFulfilled) && !onFulfilled.name.startsWith("bound ");

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
            }
        }
        if (onRejected && typeof onRejected === "function") {
            wrappedRejected = function(r) {
                if (newPromise.$isSettled) {
                    // eslint-disable-next-line no-debugger
                    debugger
                }
                // if (!newPromise.$isSettled) {
                return onRejected(r)
                // }
            }
        }

        let type = forceType || (isNative ? "await" : onFulfilled === undefined ? "catch" : "then");
        newPromise = Object.assign(super.then(wrappedFulfilled, wrappedRejected), this);
        moduleGenId.uid--; // reverse because not a new chain
        newPromise.$type = type;

        if (JFACTORY_DEV) {
            newPromise.$dev_position = this.$chain.chainMap.size;
            let fNames = "";
            if (onFulfilled && onFulfilled.name) {
                fNames += onFulfilled.name
            }
            if (onRejected && onRejected.name) {
                fNames += "," + onRejected.name
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
                $dev_path: { value: new JFactoryPromisePath(this.$dev_path, newPromise) },
                $dev_onFulfilled: { value: onFulfilled },
                $dev_onRejected: { value: onRejected }
            });
        }

        newPromise.$chain.chainMap.set(newPromise, false);

        if (this.$isExpired) {
            // case: p0.then(); chainAbort(); p1.then()
            // => the new promise must be expired
            // if parent promise is just expired, abort silently
            // if parent promise is aborted, abort explicitly
            JFactoryPromise.setExpired(newPromise, true, !this.$isAborted, this.$chain.errorExpired);
        }

        return newPromise
    }

    $catchExpired(onExpired) {
        return this.then(r => {
            if (this.$chain.chainRoot.$isExpired) {
                return onExpired(r)
            } else {
                return r
            }
        }, undefined, "$catchExpired")
    }

    static resolve(optionalArgs, value) {
        // resolve()
        // resolve(optionalArgs, value)
        // resolve(value)

        if (arguments.length === 1) {
            [optionalArgs, value] = [{}, optionalArgs]
        }
        if (!optionalArgs) {
            optionalArgs = {}
        }
        if (value instanceof this && arguments.length === 1) {
            // Returns the promise as is (native spec)
            // but only if no optionalArgs
            return value
        } else {
            return new this(optionalArgs, function(resolve) {
                resolve(value)
            });
        }
    }

    static reject(optionalArgs, reason) {
        // reject()
        // reject(optionalArgs, reason)
        // reject(reason)

        if (arguments.length === 1) {
            [optionalArgs, reason] = [{}, optionalArgs]
        }
        if (!optionalArgs) {
            optionalArgs = {}
        }
        return new this(optionalArgs, function(resolve, reject) {
            reject(reason)
        });
    }

    $toPromise() {
        return Promise.resolve(this)
    }

    // Completes an expires the whole chain before its normal end
    // Sets the $isAborted to true on aborted promises
    $chainAbort(reason = "$chainAbort()") {
        this.$chain.complete(reason, true);
        return this
    }

    // Manually completes an expires the whole chain
    // Only required if awaiting "myPromise.$chain"
    // when the autocomplete watcher is not used
    $chainComplete(reason = "$chainComplete()") {
        try {
            this.$chain.complete(reason, false);
        } catch (e) {
            if (e instanceof JFACTORY_ERR_INVALID_CALL) {
                throw new JFACTORY_ERR_INVALID_CALL({
                    target: e.$data.target,
                    reason: "Trying to complete a pending chain. Use $chainAbort() if you want to stop it."
                });
            } else {
                throw e
            }
        }
        return this
    }

    $chainAutoComplete() {
        this.$chain.chainConfig.chainAutoComplete = true;
        return this
    }

    static setExpired(promise, abort, silent, reason) {
        if (!promise.$isSettled) {
            if (abort) {
                promise.$isAborted = !silent;
                promise.__resolve__(reason);
            } else {
                throw new JFACTORY_ERR_INVALID_CALL({
                    target: promise,
                    reason: "promise must be aborted or settled before setting it to expired."
                });
            }
        }
        promise.$isExpired = true;
    }
}

JFactoryPromise.DEFAULT_CONFIG = {
    chainAutoComplete: false
};

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryPromiseChain
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryPromiseChain {

    constructor(chainRoot, chainId, chainName, chainConfig) {
        Object.defineProperties(this, {
            chainConfig: { value: chainConfig },
            chainRoot: { value: chainRoot },
            chainId: { value: chainId },
            chainName: { value: chainName },
            chainMap: { value: new Map },
            isCompleted: { value: false, configurable: true },
            data: { value: {} },
            // eslint-disable-next-line new-cap
            __deferred__: { value: jQuery.Deferred() }
        })
    }

    get isPending() {
        return Array.from(this.chainMap.values()).includes(false)
    }

    then(onResolve) { // => "await chain"
        this.__deferred__.done(onResolve);
        return this
    }

    complete(reason = "chain.complete()", abort ) {
        let chainRoot = this.chainRoot;
        if (!chainRoot.$isExpired) {
            let errorExpired = chainRoot.$chain.errorExpired = new JFACTORY_ERR_PROMISE_EXPIRED({
                target: chainRoot,
                reason
            });

            let map = this.chainMap;
            for (let item of map.keys()) {
                JFactoryPromise.setExpired(item, abort, false, errorExpired);
            }

            Object.defineProperty(this, "isCompleted", { value: true });
            this.__deferred__.resolve();
        }
        return this
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryPromisePath
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryPromisePath extends Array {

    constructor() {
        super();
        for (let i of arguments) {
            if (Array.isArray(i)) {
                this.push(...i)
            } else {
                this.push(i)
            }
        }
    }

    get printable() {
        return this.map((v, i) => i === 0 ? v.$dev_name : v.$dev_name.split(".")[1]).join(".")
    }

    toString() {return this.printable}
}

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryPromiseSync
// ---------------------------------------------------------------------------------------------------------------------
// Promise that tries to resolve synchronously
// allowing synchronous states and result
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryPromiseSync extends Promise {

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
                        .then(onResolve, onReject)
                } else {
                    if (!called) {
                        called = true;
                        states.$isSettled = true;
                        states.$isRejected = false;
                        states.$value = r;
                        resolve(r)
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
                    reject(r)
                }
            };

            try {
                executor(onResolve, onReject)
            } catch (e) {
                onReject(e)
            }
        });

        Object.assign(this, states);
        states = this
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
                        value = onRejected(value)
                    } else {
                        return JFactoryPromiseSync.reject(value)
                    }
                } else {
                    if (onFulfilled && typeof onFulfilled === "function") {
                        value = onFulfilled(value)
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

jFactoryCompat_require(
    JFACTORY_COMPAT_fetch,
    JFACTORY_COMPAT_Request,
    JFACTORY_COMPAT_AbortController
);