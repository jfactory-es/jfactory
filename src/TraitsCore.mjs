/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// TraitCore
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

import { JFACTORY_DEV, jFactoryConfig } from "./jFactory-env";
import { jFactoryError, JFactoryError } from "./JFactoryError";
import { jFactory } from "./jFactory";
import { JFactoryExpect } from "./JFactoryExpect";
import { JFactoryAbout } from "./JFactoryAbout";
import { JFactoryLogger } from "./JFactoryLogger";
import { JFactoryPromise, JFactoryPromiseSync } from "./JFactoryPromise";
import { JFactoryEventsManager } from "./JFactoryEvents";
import { JFactoryObject } from "./JFactoryObject";
import { JFactoryTimeTrace } from "./JFactoryTime";

// ---------------------------------------------------------------------------------------------------------------------
// Trait Object
// ---------------------------------------------------------------------------------------------------------------------

export class TraitCore {
    trait_constructor() {
        const owner = this;

        class SubMap extends Map {
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
                // task.$chainAutoComplete()
                promise.$chain.then(() => { // synchronous then
                    task.$chainComplete("task completed")
                });

                // Aborted task must abort the promise if still running
                task.$chain.then(() => {// synchronous then
                    if (!promise.$chain.isCompleted) {
                        promise.$chainAbort("aborted by task")
                    }
                });

                Object.defineProperty(promise, "$phaseRemove", { value: task.$phaseRemove });
                this.set(key, promise);
                return task
            }
        }

        const proto = Object.assign(Object.create(null), {
            [TraitCore.SYMBOL_PRIVATE]: Object.create(null),
            assign: function(property, value, descriptor) {JFactoryObject.assign(this, property, value, descriptor)},
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

// ---------------------------------------------------------------------------------------------------------------------
// Trait About
// ---------------------------------------------------------------------------------------------------------------------

export class TraitAbout {

    trait_constructor(about) {
        JFactoryObject.assign(this.$, "about",
            new JFactoryAbout(this, about), JFactoryObject.descriptors.READONLY)
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Log
// ---------------------------------------------------------------------------------------------------------------------

export class TraitLog {

    trait_constructor() {
        let config = Object.assign({
            label: this.$.about.name
        }, jFactoryConfig.TraitLog || {
            enabled: false
        });

        let logger = new JFactoryLogger(config);

        Object.defineProperty(this.$, "logger", { value: logger });

        logger.installAccessor("log",   "$log",     this);
        logger.installAccessor("warn",  "$logWarn", this);
        logger.installAccessor("error", "$logErr",  this);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Tasks
// ---------------------------------------------------------------------------------------------------------------------

export class TraitTask {

    trait_constructor() {
        // const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        // kernel.on("disable", () => {
        //     if (this.$.tasks.size) {debugger}
        //     // this.$taskRemoveAll(TraitService.PHASE.DISABLE)
        // });
        // kernel.on("uninstall", () => {
        //     if (this.$.tasks.size) {debugger}
        //     // this.$taskRemoveAll(TraitService.PHASE.UNINSTALL)
        // });
        this.$.assign("tasks", new Map, JFactoryObject.descriptors.ENUMERABLE);
    }

    $task(id, executorOrValue) {
        if (JFACTORY_DEV) {
            JFactoryExpect("$task(id)", id).typeString();
            JFactoryExpect("$task(executorOrValue)", executorOrValue).notUndefined();
            if (this.$.tasks.has(id)) {
                throw new jFactoryError.KEY_DUPLICATED({ target: "$task(id)", given: id })
            }
        }

        let task;

        if (typeof executorOrValue === "function") {
            task  = new JFactoryPromise({ name: id, owner: this }, executorOrValue)
        } else {
            task = JFactoryPromise.resolve({ name: id, owner: this }, executorOrValue);
        }

        task.$phaseRemove = TraitService.getContextualRemovePhase(this);

        let metrics;
        if (JFACTORY_DEV) {
            metrics = new JFactoryTimeTrace();
            task.$taskMetrics = { $dev_timing: metrics };
        }

        task.$chain.then(() => {
            if (JFACTORY_DEV) {
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
        if (JFACTORY_DEV) {
            JFactoryExpect("$taskRemove(id)", id).typeString();
            reason && JFactoryExpect("$taskRemove(reason)", reason).typeString();
            if (!this.$.tasks.has(id)) {
                throw new jFactoryError.KEY_MISSING({
                    target: "$taskRemove(id)",
                    given: id
                })
            }
            // eslint-disable-next-line no-debugger
            if (this.$.tasks.get(id)._called) {debugger}
            this.$.tasks.get(id)._called = true
        }

        let entry = this.$.tasks.get(id);
        // deleting before chainAbort() to prevent remove() recall
        this.$.tasks.delete(id);
        entry.$chainAbort(reason || "$taskRemove()");
    }

    $taskRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("$taskRemoveAll(removePhase)", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let tasks = this.$.tasks;
        if (tasks.size) {
            for (const [key, task] of tasks) {
                if (task.$phaseRemove === removePhase) {
                    this.$taskRemove(key, "$taskRemoveAll(" + removePhase + ")")
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
                    pending.push(task.$chain)
                }
            }
        }
        if (pending.length) {
            return Promise.all(pending);
        } else {
            return JFactoryPromiseSync.resolve()
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Events
// ---------------------------------------------------------------------------------------------------------------------

export class TraitEvents {

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
            })
        }
    }

    $on(/* events, target, selector, handler, options */) {
        this.$[TraitCore.SYMBOL_PRIVATE].events.custom.on(...arguments)
    }

    $off(/* events, target, selector, handler, options */) {
        this.$[TraitCore.SYMBOL_PRIVATE].events.custom.off(...arguments)
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

// ---------------------------------------------------------------------------------------------------------------------
// Trait States
// ---------------------------------------------------------------------------------------------------------------------

export class TraitState {

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
        if (JFACTORY_DEV) {
            JFactoryExpect("$state(key)", key).typeString();
            JFactoryExpect("$state(notify)", notify).typeBoolean();
        }

        return new JFactoryPromiseSync(async resolve => {

            let states = this.$[TraitCore.SYMBOL_PRIVATE].states;
            let previousVal = states[key];
            let pending;

            if (!(key in states) || previousVal !== val) {

                pending = notify && this.$notify("beforeStateChange", { key, val, previousVal });
                if (JFACTORY_DEV) {
                    pending && JFactoryExpect("beforeStateChange result", pending).type(JFactoryPromiseSync);
                }

                if (pending && !pending.$isSettled) {
                    states[key] = pending;
                    await pending;
                }

                if (val === undefined) {
                    delete states[key]
                } else {
                    states[key] = val;
                }

                pending = notify && this.$notify("afterStateChange", { key, val, previousVal });
                if (JFACTORY_DEV) {
                    pending && JFactoryExpect("afterStateChange result", pending).type(JFactoryPromiseSync);
                }
            }

            if (pending) {
                pending.then(resolve);
            } else {
                resolve()
            }
        });
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Service
// ---------------------------------------------------------------------------------------------------------------------

export class TraitService {

    trait_constructor() {
        /**
         * @name this.$.service
         * @type {object}
         */
        JFactoryObject.assign(this.$, "service", Object.create(null), JFactoryObject.descriptors.READONLY);
        this.$.service.phase = TraitService.PHASE.NONE;
        this.$.service.phaseQueue = JFactoryPromiseSync.resolve();

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

        let resolvePromises = handler => {
            if (this.$.tasks.size) {
                this.$taskRemoveAll(this.$.service.phase)
            }
            let promise = JFactoryPromiseSync.resolve(); // this.$taskPromiseAll(true);
            if (handler) {
                promise = promise
                    .then(() => handler.call(this))
                    .then(() => this.$taskPromiseAll(true))
            }
            return promise
                .catch(e => {
                    if (!(this.$.service.isPhaseKilling && e instanceof jFactoryError.PROMISE_EXPIRED)) {
                        this.$logErr("unhandled promise rejection in " + this.$.service.phase + ";",
                            ...e instanceof JFactoryError ? e : [e])
                    }
                });
        };

        kernel.on("install", () => resolvePromises(this.onInstall));
        kernel.on("enable", () => resolvePromises(this.onEnable));
        kernel.on("disable", () => resolvePromises(this.onDisable));
        kernel.on("uninstall", () => resolvePromises(this.onUninstall));

        kernel.on("disable",   () => this.$off({ removal: TraitService.PHASE.DISABLE }));
        kernel.on("uninstall", () => this.$off({ removal: TraitService.PHASE.UNINSTALL }));
    }

    $install(enable) {
        if (!this.$.service.phaseQueue.$isSettled) {
            return this.$.service.phaseQueue
                .then(() => this.$install())
        }

        // eslint-disable-next-line no-debugger
        if (JFACTORY_DEV) {if (this.$.service.isPhaseKilling) {debugger}}

        return this.$.service.phaseQueue = JFactoryPromiseSync.resolve()
            .then(() => {
                if (!this.$.states.installed) {
                    this.$.service.phase = TraitService.PHASE.INSTALL;
                    return this.$state("installed", true)
                }
            })
            .then(() => {
                if (enable && this.$.states.installed && !this.$.states.enabled) {
                    this.$.service.phase = TraitService.PHASE.ENABLE;
                    return this.$state("enabled", true)
                }
            })
            .then(() => {
                this.$.service.phase = TraitService.PHASE.NONE;
            })
    }

    $enable() {
        if (!this.$.service.phaseQueue.$isSettled) {
            return this.$.service.phaseQueue
                .then(() => this.$enable())
        }

        // eslint-disable-next-line no-debugger
        if (JFACTORY_DEV) {if (this.$.service.isPhaseKilling) {debugger}}

        return this.$.service.phaseQueue = JFactoryPromiseSync.resolve()
            .then(() => {
                if (this.$.states.installed && !this.$.states.enabled) {
                    this.$.service.phase = TraitService.PHASE.ENABLE;
                    return this.$state("enabled", true)
                }
            })
            .then(() => {
                this.$.service.phase = TraitService.PHASE.NONE;
            })
    }

    $disable() {
        if (!this.$.service.phaseQueue.$isSettled) {
            return TraitService.phaseKill(this)
                .then(() => this.$disable())
        }

        // eslint-disable-next-line no-debugger
        if (JFACTORY_DEV) {if (this.$.service.isPhaseKilling) {debugger}}

        return this.$.service.phaseQueue = JFactoryPromiseSync.resolve()
            .then(() => {
                if (this.$.states.enabled) {
                    this.$.service.phase = TraitService.PHASE.DISABLE;
                    return this.$state("enabled", false)
                }
            })
            .then(() => {
                this.$.service.phase = TraitService.PHASE.NONE;
            })
    }

    $uninstall() {
        if (!this.$.service.phaseQueue.$isSettled) {
            return TraitService.phaseKill(this)
                .then(() => this.$uninstall())
        }

        // eslint-disable-next-line no-debugger
        if (JFACTORY_DEV) {if (this.$.service.isPhaseKilling) {debugger}}

        return this.$.service.phaseQueue = JFactoryPromiseSync.resolve()
            .then(() => {
                if (this.$.states.enabled) {
                    return this.$disable()
                }
            })
            .then(() => {
                if (this.$.states.installed) {
                    this.$.service.phase = TraitService.PHASE.UNINSTALL;
                    return this.$state("installed", false)
                }
            })
            .then(() => {
                this.$.service.phase = TraitService.PHASE.NONE;
            });
    }

    static phaseKill(component) {
        return new Promise(resolve => {
            if (!component.$.service.phaseQueue.$isSettled) {
                component.$.service.isPhaseKilling = true;
                // component.$logWarn("phase kill [" + component.$.service.phase + "]...");
                if (component.$.tasks.size) {
                    component.$taskRemoveAll(TraitService.getContextualRemovePhase(component), true);
                }
                setTimeout(() => resolve(TraitService.phaseKill(component)), 50)
            } else {
                component.$.service.isPhaseKilling = false;
                resolve()
            }
        })
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
            newRemovePhase = TraitService.PHASE.UNINSTALL
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

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

export function assignPrivate(scope, property, value, descriptor) {
    JFactoryObject.assign(scope.$[TraitCore.SYMBOL_PRIVATE], property, value, descriptor)
}

export function assignPrivateMember(scope, property, value, descriptor) {
    JFactoryObject.assign(scope.$[TraitCore.SYMBOL_PRIVATE][property], value, descriptor)
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

jFactory.PHASE = JFactoryObject.disinherit(TraitService.PHASE);

jFactory.TraitCore = TraitCore;
jFactory.TraitAbout = TraitAbout;
jFactory.TraitLog = TraitLog;
jFactory.TraitEvents = TraitEvents;
jFactory.TraitState = TraitState;
jFactory.TraitService = TraitService;
jFactory.TraitTask = TraitTask;