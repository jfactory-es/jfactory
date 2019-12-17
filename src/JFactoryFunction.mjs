/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_DEV, jFactoryConfig } from "./jFactory-env";
import { JFactoryExpect } from "./JFactoryExpect";
import { jFactoryError } from "./JFactoryError";
import { setFunctionName } from "./jFactory-helpers";

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryFunctionComposer
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export class JFactoryFunctionComposer {

    constructor() {
        this.handlers = Object.create(null);
    }

    * [Symbol.iterator](handlerGroups = []) {

        if (!handlerGroups.length) {
            handlerGroups = Object.keys(this.handlers)
        }
        if (!handlerGroups.length) {
            handlerGroups = ["default"]
        }

        for (let handlerGroup of handlerGroups) {
            if (handlerGroup in this.handlers) {
                yield* this.handlers[handlerGroup]
            }
        }
    }

    /** @return {JFactoryFunctionComposer} */
    first(handlerGroup, handler) {
        if (arguments.length === 1) {
            [handlerGroup, handler] = ["default", handlerGroup]
        }
        (this.handlers[handlerGroup] || (this.handlers[handlerGroup] = [])).unshift(handler);
        return this
    }

    /** @return {JFactoryFunctionComposer} */
    last(handlerGroup, handler) {
        if (arguments.length === 1) {
            [handlerGroup, handler] = ["default", handlerGroup]
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
                result = handler.call(scope, context, ...context.parameters)
            } else {
                result = handler(context, ...context.parameters)
            }
            iteration = handlers.next(); // prepares next iteration to know if "done"
            if (result instanceof Promise) {
                if (iteration.done
                    // case of last handler returning a promise
                    // #limitation# now way to detect if the promise is the returned value or an "await"
                    // (we don't want to change the value of context.result during a pending handler)
                    // => native Promise are always chained
                    && result.constructor !== Promise) {
                    context.result = result // we can safely set the new result
                } else {
                    return result.then(
                        setFunctionName([handler.name, "compositeAsyncHandler"].filter(Boolean).join(" "),
                            function(value) {
                                context.result = value;
                                return JFactoryFunctionComposer.composite_iterator(scope, context, iteration, handlers)
                            })
                    )
                }
            } else {
                context.result = result
            }
        }
        return context.result
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryFunctionExpirable - Expirable Function Pattern
// ---------------------------------------------------------------------------------------------------------------------

export function jFactoryFunctionExpirable(originalHandler) {
    return new JFactoryFunctionExpirable(originalHandler).compose()
}

export class JFactoryFunctionExpirable {

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
            value instanceof Error ? value : new jFactoryError.INVALID_CALL({
                target: this.originalHandler,
                reason: "manually expired"
            }) : Boolean(this.expiredCalls = 0);

        this.addExpireCondition = function(condition) {
            this.composer.last("conditions", function(context) {
                let done = function(result) {
                    if (JFACTORY_DEV) {
                        JFactoryExpect("JFactoryFunctionExpirable.addExpireCondition(), result", result)
                            .type(Boolean, Error)
                    }
                    return expirable.setExpired(result ?
                        (context.canceled = true) &&
                        (result instanceof Error ?
                            result :
                            new jFactoryError.INVALID_CALL({
                                target: expirable.originalHandler,
                                reason: "conditionally expired",
                                condition
                            })
                        ) : false
                    )
                };
                let result = condition.apply(this, context.parameters);
                return result instanceof Promise ? result.then(done) : done(result);
            })
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
            if (jFactoryConfig.TraitLog) {
                console.warn(...new jFactoryError.INVALID_CALL({
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

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryFunctionConditional - Conditional Function Pattern
// ---------------------------------------------------------------------------------------------------------------------

export function jFactoryFunctionConditional(originalHandler) {
    return new JFactoryFunctionConditional(originalHandler).compose()
}

export class JFactoryFunctionConditional {

    constructor(originalHandler) {
        this.originalHandler = originalHandler;
        this.composer = new JFactoryFunctionComposer;
        this.composer.first("original", setFunctionName([originalHandler.name, "condition"]
            .filter(Boolean).join(" "), function(context) {
            return originalHandler.apply(this, context.parameters);
        }));
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
                if (JFACTORY_DEV) {
                    JFactoryExpect("JFactoryFunctionConditional.addCondition(), result", result)
                        .typeBoolean();
                }
                !result && (context.canceled = true);
            };
            let result = condition.apply(this, context.parameters);
            return result instanceof Promise ? result.then(handle) : handle(result);
        })
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// JFactoryFunctionWrappable - Wrappable Function Pattern
// ---------------------------------------------------------------------------------------------------------------------

export function jFactoryFunctionWrappable(originalHandler) {
    return new JFactoryFunctionWrappable(originalHandler).compose()
}

export class JFactoryFunctionWrappable {

    constructor(originalHandler) {
        this.originalHandler = originalHandler;
        this.composer = new JFactoryFunctionComposer;
        this.composer.first("original", setFunctionName([originalHandler.name, "wrapped"]
            .filter(Boolean).join(" "), function(context) {
            return originalHandler.apply(this, context.parameters);
        }));
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