'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactory = require('./jFactory.cjs');
const jFactoryCompat = require('./jFactory-compat.cjs');
const JFactoryError = require('./lib/JFactoryError.cjs');
const JFactoryExpect = require('./lib/JFactoryExpect.cjs');
const TraitsCore = require('./TraitsCore.cjs');
const JFactoryFetch = require('./lib/JFactoryFetch.cjs');
const JFactoryPromise = require('./lib/JFactoryPromise.cjs');
const JFactoryObject = require('./lib/JFactoryObject.cjs');
const JFactoryTrace = require('./lib/JFactoryTrace.cjs');
const jFactoryHelpers = require('./jFactory-helpers.cjs');
const jQuery = require('jquery');
const helper_isPlainObject = require('lodash/isPlainObject.js');

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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$fetchRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$fetchRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("requests", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $fetch(id, url, fetchOptions = {}) {
        id = this.$.requests.$id_resolve(id);

        {
            JFactoryExpect.JFactoryExpect("$fetch(id)", id).typeString();
            JFactoryExpect.JFactoryExpect("$fetch(url)", url).typeString();
            JFactoryExpect.JFactoryExpect("$fetch(fetchOptions)", fetchOptions).typePlainObject();
            if (this.$.requests.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$fetch(id)", given: id })
            }
        }

        let promise = new JFactoryFetch.JFactoryFetch({
            name: id,
            traceSource: JFactoryTrace.jFactoryTrace.captureTraceSource("$fetch"),
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
            JFactoryExpect.JFactoryExpect("$fetchRemove(id)", id).typeString();
            reason && JFactoryExpect.JFactoryExpect("$fetchRemove(reason)", reason).typeString();
            if (!this.$.requests.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$timeoutRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$timeoutRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("timeouts", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $timeout(id, delay, handler = null, ...args) {
        // id
        // id, delay
        // id, delay, handler, ...args

        id = this.$.timeouts.$id_resolve(id);

        {
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("delay", delay).typeNumber();
            JFactoryExpect.JFactoryExpect("handler", handler).type(Function, null);
            if (this.$.timeouts.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$timeout(id)", given: id })
            }
        }

        let timer;
        let promise = new JFactoryPromise.JFactoryPromise(
            {
                name: id,
                traceSource: JFactoryTrace.jFactoryTrace.captureTraceSource("$timeout"),
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
            JFactoryExpect.JFactoryExpect("$timeoutRemove(id)", id).typeString();
            reason && JFactoryExpect.JFactoryExpect("$timeoutRemove(reason)", reason).typeString();
            if (!this.$.timeouts.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$intervalRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$intervalRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("timeints", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $interval(id, delay, handler, ...args) {
        id = this.$.timeints.$id_resolve(id);
        {
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("handler", handler).typeFunction();
            JFactoryExpect.JFactoryExpect("delay", delay).typeNumber();
            if (this.$.timeints.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$interval(id)", given: id })
            }
        }
        let timer = setInterval(handler, delay, ...args);
        this.$.timeints.$registerSync(id, timer);
    }

    $intervalRemove(id) {
        {
            JFactoryExpect.JFactoryExpect("$intervalRemove(id)", id).typeString();
            if (!this.$.timeints.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
    jFactoryCompat.jFactoryCompat_require(jFactoryCompat.JFACTORY_COMPAT_MutationObserver);
}

class TraitMutation {
    trait_constructor() {
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$mutationRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$mutationRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("mutations", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $mutation(id, parent, config, handler) {
        id = this.$.mutations.$id_resolve(id);
        {
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("parent", parent).type(HTMLElement, Document);
            JFactoryExpect.JFactoryExpect("config", config).typePlainObject();
            JFactoryExpect.JFactoryExpect("handler", handler).typeFunction();
            if (this.$.mutations.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$mutation(id)", given: id })
            }
        }
        let observer = new MutationObserver(handler);
        observer.observe(parent, config);
        this.$.mutations.$registerSync(id, observer);
    }

    $mutationRemove(id, reason) {
        {
            JFactoryExpect.JFactoryExpect("$mutationRemove(id)", id).typeString();
            reason && JFactoryExpect.JFactoryExpect("$mutationRemove(reason)", reason).typeString();
            if (!this.$.mutations.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$domRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$domRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("dom", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $dom(id, jQueryArgument, appendTo) {
        id = this.$.dom.$id_resolve(id);

        {
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("jQueryArgument", jQueryArgument).type(String, jQuery, HTMLElement);
            appendTo && JFactoryExpect.JFactoryExpect("appendTo", appendTo).type(String, jQuery, HTMLElement);
        }

        let domId;
        if (id[0] === "#") {
            id = id.substring(1);
            domId = true;
        }

        if (this.$.dom.has(id)) {
            throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$dom(id)", given: id })
        }

        let dom = jQuery(jQueryArgument);

        if (dom[0].tagName === "TEMPLATE") {
            dom = jQuery(jQuery(dom[0]).html());
        }

        if (domId) {
            {
                if (dom[0].nodeType !== Node.ELEMENT_NODE) {
                    throw new JFactoryError.JFACTORY_ERR_INVALID_VALUE({
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
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("url", url).typeString();
            appendTo && JFactoryExpect.JFactoryExpect("appendTo", appendTo).type(String, Object);
            fetchOptions && JFactoryExpect.JFactoryExpect("fetchOptions", fetchOptions).type(Object);
        }

        let domId;
        if (id[0] === "#") {
            id = id.substring(1);
            domId = true;
        }

        if (this.$.dom.has(id)) {
            throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$domFetch(id)", given: id })
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
            JFactoryExpect.JFactoryExpect("$domRemove(id)", id).typeString();
            reason && JFactoryExpect.JFactoryExpect("$domRemove(reason)", reason).typeString();
            if (!this.$.dom.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
        if (entry instanceof JFactoryFetch.JFactoryFetch) {
            entry.$chainAbort(reason || "$domRemove()");
        }
        this.$.dom.delete(id);
    }

    $domRemoveAll(removePhase) {
        {
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$cssRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$cssRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("css", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $css(id, styleBody) {
        id = this.$.css.$id_resolve(id);

        {
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("css", styleBody).typeString();
        }

        let cssId;
        if (id[0] === "#") {
            id = id.substring(1);
            cssId = true;
        }

        if (this.$.css.has(id)) {
            throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$css(id)", given: id })
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
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("url", url).typeString();
        }

        let cssId;
        if (id[0] === "#") {
            id = id.substring(1);
            cssId = true;
        }

        if (this.$.css.has(id)) {
            throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$cssFetch(id)", given: id })
        }

        url = jFactoryHelpers.helper_url_abs(url);

        let exist = jQuery(appendTo).find(`link[href="${url}"]`)[0];
        if (exist) {
            exist.dataset.usage = parseInt(exist.dataset.usage) + 1;
            let dom = jQuery(exist);

            let promise = JFactoryPromise.JFactoryPromise.resolve(
                {
                    name: id,
                    config: { chainAutoComplete: true },
                    traceSource: JFactoryTrace.jFactoryTrace.captureTraceSource("$cssFetch")
                },
                dom
            );
            promise.$chain.data.dom = dom;
            this.$.css.$registerAsync(id, '$cssFetch("' + id + '")', promise);

            return promise
        } else {
            let dom;
            let promise = new JFactoryPromise.JFactoryPromise(
                {
                    name: id,
                    config: { chainAutoComplete: true },
                    traceSource: JFactoryTrace.jFactoryTrace.captureTraceSource("$cssFetch")
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
            JFactoryExpect.JFactoryExpect("$cssRemove(id)", id).typeString();
            reason && JFactoryExpect.JFactoryExpect("$cssRemove(reason)", reason).typeString();
            if (!this.$.css.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
        if (entry instanceof JFactoryPromise.JFactoryPromise) {
            entry.$chainAbort(reason || "$cssRemove()");
        }
        this.$.css.delete(id);
    }

    $cssRemoveAll(removePhase) {
        {
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$vueRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$vueRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("vue", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $vue(id, vue) {
        id = this.$.vue.$id_resolve(id);

        {
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("vue", vue).type(Object);
        }

        if (this.$.vue.has(id)) {
            throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$vue(id)", given: id })
        }

        return this.$.vue.$registerSync(id, vue).$value;
    }

    $vueRemove(id) {
        {
            JFactoryExpect.JFactoryExpect("$vueRemove(id)", id).typeString();
            if (!this.$.vue.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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
        const kernel = this.$[TraitsCore.TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$reactRemoveAll(TraitsCore.TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$reactRemoveAll(TraitsCore.TraitService.PHASE.UNINSTALL));
        this.$.assign("react", this.$.createSubMap(), JFactoryObject.JFactoryObject.descriptors.ENUMERABLE);
    }

    $react(id, container, element, ...renderOtherArguments) {
        id = this.$.react.$id_resolve(id);

        {
            if (!jFactory.jFactory.ReactDOM) {
                throw new Error("jFactory.ReactDOM=ReactDOM must be set before using the React Trait");
            }
            JFactoryExpect.JFactoryExpect("id", id).typeString();
            JFactoryExpect.JFactoryExpect("container", container).type(HTMLElement, jQuery);
        }

        if (this.$.react.has(id)) {
            throw new JFactoryError.JFACTORY_ERR_KEY_DUPLICATED({ target: "$react(id)", given: id })
        }

        container = jQuery(container)[0];
        let view = jFactory.jFactory.ReactDOM.render(element, container, ...renderOtherArguments);
        return this.$.react.$registerSync(id, { container, view }).$value.view;
    }

    $reactRemove(id) {
        {
            JFactoryExpect.JFactoryExpect("$reactRemove(id)", id).typeString();
            if (!this.$.react.has(id)) {
                throw new JFactoryError.JFACTORY_ERR_KEY_MISSING({
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
            if (!jFactory.jFactory.ReactDOM.unmountComponentAtNode(el)) {
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
            JFactoryExpect.JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitsCore.TraitService.PHASES);
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

exports.TraitCSS = TraitCSS;
exports.TraitDOM = TraitDOM;
exports.TraitFetch = TraitFetch;
exports.TraitInterval = TraitInterval;
exports.TraitLibReact = TraitLibReact;
exports.TraitLibVue = TraitLibVue;
exports.TraitMutation = TraitMutation;
exports.TraitTimeout = TraitTimeout;
