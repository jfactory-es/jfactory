'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryEnv = require('./jFactory-env.cjs');
const JFactoryError = require('./lib/JFactoryError.cjs');
const jFactory = require('./jFactory.cjs');
const JFactoryExpect = require('./lib/JFactoryExpect.cjs');
const JFactoryAbout = require('./lib/JFactoryAbout.cjs');
const JFactoryLogger = require('./lib/JFactoryLogger.cjs');
const JFactoryPromise = require('./lib/JFactoryPromise.cjs');
const JFactoryEvents = require('./lib/JFactoryEvents.cjs');
const JFactoryObject = require('./lib/JFactoryObject.cjs');
const JFactoryTime = require('./lib/JFactoryTime.cjs');

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
            assign: function(property, value, descriptor) {JFactoryObject.JFactoryObject.assign(this, property, value, descriptor);},
            createSubMap: () => new SubMap()
        });

        Object.defineProperty(this, "$", { value: Object.create(proto) });

        // pre-define most important properties
        // to order them first in devtool (reduced form only)
        this.$.assign({
            tasks: null,
            requests: null
        }, JFactoryObject.JFactoryObject.descriptors.ENUMERABLE_WRITABLE);
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
        JFactoryObject.JFactoryObject.assign(this.$, "about",
            new JFactoryAbout.JFactoryAbout(this, about), JFactoryObject.JFactoryObject.descriptors.READONLY);
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
        }, jFactoryEnv.JFACTORY_LOG || {
            enabled: false
        });

        let logger = new JFactoryLogger.JFactoryLogger(config);

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
        this.$.assign("tasks", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $task(id, executorOrValue) {
        id = this.$.tasks.$id_resolve(id);

        {
            JFactoryExpect.JFactoryExpect("$task(id)", id).typeString();
            JFactoryExpect.JFactoryExpect("$task(executorOrValue)", executorOrValue).notUndefined();
            if (this.$.tasks.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$task(id)", given: id })
            }
        }

        let task;

        if (typeof executorOrValue === "function") {
            task  = new JFactoryPromise.JFactoryPromise({ name: id, owner: this }, executorOrValue);
        } else {
            task = JFactoryPromise.JFactoryPromise.resolve({ name: id, owner: this }, executorOrValue);
        }

        task.$phaseRemove = TraitService.getContextualRemovePhase(this);

        let metrics;
        {
            metrics = new JFactoryTime.JFactoryTimeTrace();
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
            JFactoryExpect.JFactoryExpect("$taskRemove(id)", id).typeString();
            reason && JFactoryExpect.JFactoryExpect("$taskRemove(reason)", reason).typeString();
            if (!this.$.tasks.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            JFactoryExpect.JFactoryExpect("$taskRemoveAll(removePhase)", removePhase)
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
            return JFactoryPromise.JFactoryPromise.all(pending);
        } else {
            return JFactoryPromise.JFactoryPromiseSync.resolve()
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
            custom: new JFactoryEvents.JFactoryEventsManager(this),
            kernel: new JFactoryEvents.JFactoryEventsManager(this)
        }, JFactoryObject.JFactoryObject.descriptors.NONE);

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

        assignPrivate(this, { states, stateRoutes }, JFactoryObject.JFactoryObject.descriptors.READONLY);

        JFactoryObject.JFactoryObject.assign(this.$, "states", new Proxy(states, {
            set: (target, key, val) => this.$state(key, val),
            get: (target, key) => states[key]
        }), JFactoryObject.JFactoryObject.descriptors.READONLY);

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
            JFactoryExpect.JFactoryExpect("$state(key)", key).typeString();
            JFactoryExpect.JFactoryExpect("$state(notify)", notify).typeBoolean();
        }

        return new JFactoryPromise.JFactoryPromiseSync(async resolve => {

            let states = this.$[TraitCore.SYMBOL_PRIVATE].states;
            let previousVal = states[key];
            let pending;

            if (!(key in states) || previousVal !== val) {

                pending = notify && this.$notify("beforeStateChange", { key, val, previousVal });
                {
                    pending && JFactoryExpect.JFactoryExpect("beforeStateChange result", pending).type(JFactoryPromise.JFactoryPromiseSync);
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
                    pending && JFactoryExpect.JFactoryExpect("afterStateChange result", pending).type(JFactoryPromise.JFactoryPromiseSync);
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
        JFactoryObject.JFactoryObject.assign(this.$, "service", Object.create(null), JFactoryObject.JFactoryObject.descriptors.READONLY);
        this.$.service.phase = TraitService.PHASE.NONE;
        this.$.service.phaseQueue = JFactoryPromise.JFactoryPromise.resolve({ name: "phaseQueue" }, null);
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
        }, JFactoryObject.JFactoryObject.descriptors.NONE);

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
            let promise = JFactoryPromise.JFactoryPromiseSync.resolve();
            if (handler) {
                promise = promise
                    .then(() => handler.call(this))
                    .then(() => this.$taskPromiseAll(true));
            }
            return promise
                .catch(e => {
                    if (!(/*this.$.service.isPhaseKilling &&*/ e instanceof JFactoryError.JFACTORY_ERR_PROMISE_EXPIRED)) {
                        this.$logErr("unhandled promise rejection in " + this.$.service.phase + ";",
                            ...e instanceof JFactoryError.JFactoryError ? e : [e]);
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
        const p = new JFactoryPromise.JFactoryPromise(
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
        const p = new JFactoryPromise.JFactoryPromise(
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
        const p = new JFactoryPromise.JFactoryPromise(
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
        const p = new JFactoryPromise.JFactoryPromise(
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
    JFactoryObject.JFactoryObject.assign(scope.$[TraitCore.SYMBOL_PRIVATE], property, value, descriptor);
}

function assignPrivateMember(scope, property, value, descriptor) {
    JFactoryObject.JFactoryObject.assign(scope.$[TraitCore.SYMBOL_PRIVATE][property], value, descriptor);
}

jFactory.jFactory.PHASE = JFactoryObject.JFactoryObject.disinherit(TraitService.PHASE);

exports.TraitAbout = TraitAbout;
exports.TraitCore = TraitCore;
exports.TraitEvents = TraitEvents;
exports.TraitLog = TraitLog;
exports.TraitService = TraitService;
exports.TraitState = TraitState;
exports.TraitTask = TraitTask;
exports.assignPrivate = assignPrivate;
exports.assignPrivateMember = assignPrivateMember;
