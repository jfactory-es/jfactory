import { JFACTORY_ERR_INVALID_VALUE } from './JFactoryError.mjs';
import './JFactoryExpect.mjs';
import { JFactoryPromiseSync } from './JFactoryPromise.mjs';
import { JFactoryFunctionComposer } from './JFactoryFunction.mjs';
import jQuery from 'jquery';
import 'lodash/template.js';
import 'lodash/isString.js';
import 'lodash/isNumber.js';
import helper_isPlainObject from 'lodash/isPlainObject.js';
import 'lodash/defaultsDeep.js';

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
            if (namespace && this.namespace.has(namespace)) {
                return namespace
            }
        }
        return false
    }

    addNamespace(namespace) {
        this.namespace.add(namespace);
    }

    deleteNamespace(namespace) {
        this.namespace.delete(namespace);
    }

    toString() {
        return this.namespace.size ? this.event + "." + Array.from(this.namespace.values()).join(".") : this.event;
    }
}

export { JFactoryEventSelector, JFactoryEventSelectorParser, JFactoryEvents, JFactoryEventsManager };
