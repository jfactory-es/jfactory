/*! jFactory, (c) 2019-2021, Stéphane Plazis, http://github.com/jfactory-es/jfactory */

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// TraitComponents
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

import { jFactory } from "./jFactory.mjs";
import { JFACTORY_DEV } from "./jFactory-env.mjs";
import { JFACTORY_COMPAT_MutationObserver, jFactoryCompat_require } from "./jFactory-compat.mjs";
import { JFACTORY_ERR_INVALID_VALUE, JFACTORY_ERR_KEY_DUPLICATED, JFACTORY_ERR_KEY_MISSING } from "./JFactoryError.mjs";
import { JFactoryExpect } from "./JFactoryExpect.mjs";
import { TraitCore, TraitService } from "./TraitsCore.mjs";
import { JFactoryFetch } from "./JFactoryFetch.mjs";
import { JFactoryPromise } from "./JFactoryPromise.mjs";
import { JFactoryObject } from "./JFactoryObject.mjs";
import { jFactoryTrace } from "./JFactoryTrace.mjs";
import { helper_isPlainObject, helper_url_abs, jQuery } from "./jFactory-helpers.mjs";

// ---------------------------------------------------------------------------------------------------------------------
// Trait Fetch
// ---------------------------------------------------------------------------------------------------------------------

export class TraitFetch {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$fetchRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$fetchRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("requests", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $fetch(id, url, fetchOptions = {}) {
        id = this.$.requests.$id_resolve(id);

        if (JFACTORY_DEV) {
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
                this.$fetchRemove(id)
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
        if (JFACTORY_DEV) {
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
            this.$.requests.get(id)._debug_remove_called = true
        }

        let entry = this.$.requests.get(id);
        this.$.requests.delete(id);
        entry.$chainAbort(reason || "$fetchRemove()");
    }

    $fetchRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.requests;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$fetchRemove(key, "$fetchRemoveAll(" + removePhase + ")")
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Timeout
// ---------------------------------------------------------------------------------------------------------------------

export class TraitTimeout {
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

        if (JFACTORY_DEV) {
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
                }, delay)
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
        if (JFACTORY_DEV) {
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
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES);
        }
        let subs = this.$.timeouts;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$timeoutRemove(key, "$timeoutRemoveAll()")
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Interval
// ---------------------------------------------------------------------------------------------------------------------

export class TraitInterval {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$intervalRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$intervalRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("timeints", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $interval(id, delay, handler, ...args) {
        id = this.$.timeints.$id_resolve(id);
        if (JFACTORY_DEV) {
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("handler", handler).typeFunction();
            JFactoryExpect("delay", delay).typeNumber();
            if (this.$.timeints.has(id)) {
                throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$interval(id)", given: id })
            }
        }
        let timer = setInterval(handler, delay, ...args);
        this.$.timeints.$registerSync(id, timer)
    }

    $intervalRemove(id) {
        if (JFACTORY_DEV) {
            JFactoryExpect("$intervalRemove(id)", id).typeString();
            if (!this.$.timeints.has(id)) {
                throw new JFACTORY_ERR_KEY_MISSING({
                    target: "$intervalRemove(id)",
                    given: id
                })
            }
            // eslint-disable-next-line no-debugger,brace-style
            if (this.$.timeints.get(id)._debug_remove_called) {debugger}
            this.$.timeints.get(id)._debug_remove_called = true
        }
        clearInterval(this.$.timeints.get(id).$value);
        this.$.timeints.delete(id)
    }

    $intervalRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.timeints;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$intervalRemove(key)
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait Mutations
// ---------------------------------------------------------------------------------------------------------------------

if (JFACTORY_DEV) {
    jFactoryCompat_require(JFACTORY_COMPAT_MutationObserver);
}

export class TraitMutation {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$mutationRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$mutationRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("mutations", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $mutation(id, parent, config, handler) {
        id = this.$.mutations.$id_resolve(id);
        if (JFACTORY_DEV) {
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
        if (JFACTORY_DEV) {
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
            this.$.mutations.get(id)._debug_remove_called = true
        }
        this.$.mutations.get(id).$value.disconnect();
        this.$.mutations.delete(id)
    }

    $mutationRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.mutations;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$mutationRemove(key)
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Trait DOM
// ---------------------------------------------------------------------------------------------------------------------

export class TraitDOM {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$domRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$domRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("dom", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $dom(id, jQueryArgument, appendTo) {
        id = this.$.dom.$id_resolve(id);

        if (JFACTORY_DEV) {
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("jQueryArgument", jQueryArgument).type(String, Object);
            appendTo && JFactoryExpect("appendTo", appendTo).type(String, Object);
        }

        let domId;
        if (id[0] === "#") {
            id = id.substring(1);
            domId = true
        }

        if (JFACTORY_DEV && this.$.dom.has(id)) {
            throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$dom(id)", given: id })
        }

        let dom = jQuery(jQueryArgument);

        if (dom[0].tagName === "TEMPLATE") {
            dom = jQuery(jQuery(dom[0]).html());
        }

        if (domId) {
            if (JFACTORY_DEV) {
                if (dom[0].nodeType !== Node.ELEMENT_NODE) {
                    throw new JFACTORY_ERR_INVALID_VALUE({
                        target: "$dom(#id)",
                        given: dom,
                        reason: "cannot set the dom id: the first element of the selection isn't an ELEMENT_NODE"
                    })
                }
            }
            dom[0].id = id
        }

        if (appendTo) {
            dom.appendTo(appendTo)
        }

        return this.$.dom.$registerSync(id, dom).$value;
    }

    $domFetch(id, url, fetchOptions, appendTo) {
        if (fetchOptions && !helper_isPlainObject(fetchOptions)) {
            [fetchOptions, appendTo] = [{}, fetchOptions]
        }

        id = this.$.dom.$id_resolve(id);

        if (JFACTORY_DEV) {
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("url", url).typeString();
            appendTo && JFactoryExpect("appendTo", appendTo).type(String, Object);
            fetchOptions && JFactoryExpect("fetchOptions", fetchOptions).type(Object);
        }

        let domId;
        if (id[0] === "#") {
            id = id.substring(1);
            domId = true
        }

        if (JFACTORY_DEV && this.$.dom.has(id)) {
            throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$domFetch(id)", given: id })
        }

        let promise = this.$fetchText('$domFetch("' + id + '")', url, fetchOptions)
            .then(r => {
                let dom = jQuery(r);
                if (domId) {
                    dom[0].id = id
                }
                if (appendTo) {
                    dom.appendTo(appendTo)
                }
                return dom
            });

        this.$.dom.$registerAsync(id, '$domFetch("' + id + '")', promise);
        return promise
    }

    $domRemove(id, reason) {
        if (JFACTORY_DEV) {
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
            this.$.dom.get(id)._debug_remove_called = true
        }

        let entry = this.$.dom.get(id);
        let value = entry.$value;
        if (value instanceof jQuery) {
            value.remove()
        }
        if (entry instanceof JFactoryFetch) {
            entry.$chainAbort(reason || "$domRemove()");
        }
        this.$.dom.delete(id)
    }

    $domRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.dom;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$domRemove(key)
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
//  Trait CSS
// ---------------------------------------------------------------------------------------------------------------------

export class TraitCSS {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$cssRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$cssRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("css", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $css(id, styleBody) {
        id = this.$.css.$id_resolve(id);

        if (JFACTORY_DEV) {
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("css", styleBody).typeString();
        }

        let cssId;
        if (id[0] === "#") {
            id = id.substring(1);
            cssId = true
        }

        if (JFACTORY_DEV && this.$.css.has(id)) {
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

        if (JFACTORY_DEV) {
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("url", url).typeString();
        }

        let cssId;
        if (id[0] === "#") {
            id = id.substring(1);
            cssId = true
        }

        if (JFACTORY_DEV && this.$.css.has(id)) {
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
        if (JFACTORY_DEV) {
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
            this.$.css.get(id)._debug_remove_called = true
        }

        let entry = this.$.css.get(id);
        let value = entry.$chain && entry.$chain.data.dom || entry.$value;
        if (value instanceof jQuery) {
            let usage = parseInt(value[0].dataset.usage) - 1;
            if (usage) {
                value[0].dataset.usage = usage
            } else {
                value.remove()
            }
        }
        if (entry instanceof JFactoryPromise) {
            entry.$chainAbort(reason || "$cssRemove()")
        }
        this.$.css.delete(id)
    }

    $cssRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.css;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$cssRemove(key)
                }
            }
        }
    }
}

export class TraitLibVue {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$vueRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$vueRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("vue", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $vue(id, vue) {
        id = this.$.vue.$id_resolve(id);

        if (JFACTORY_DEV) {
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("vue", vue).type(Object);
        }

        if (JFACTORY_DEV && this.$.vue.has(id)) {
            throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$vue(id)", given: id })
        }

        return this.$.vue.$registerSync(id, vue).$value;
    }

    $vueRemove(id) {
        if (JFACTORY_DEV) {
            JFactoryExpect("$vueRemove(id)", id).typeString();
            if (!this.$.vue.has(id)) {
                throw new JFACTORY_ERR_KEY_MISSING({
                    target: "$vueRemove(id)",
                    given: id
                })
            }
            // eslint-disable-next-line no-debugger,brace-style
            if (this.$.vue.get(id)._debug_remove_called) {debugger}
            this.$.vue.get(id)._debug_remove_called = true
        }

        let entry = this.$.vue.get(id);
        jQuery(entry.$value.$el).remove();
        entry.$value.$destroy();
        this.$.vue.delete(id)
    }

    $vueRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.vue;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$vueRemove(key)
                }
            }
        }
    }
}

export class TraitLibReact {
    trait_constructor() {
        const kernel = this.$[TraitCore.SYMBOL_PRIVATE].events.kernel;
        kernel.on("disable", () => this.$reactRemoveAll(TraitService.PHASE.DISABLE));
        kernel.on("uninstall", () => this.$reactRemoveAll(TraitService.PHASE.UNINSTALL));
        this.$.assign("react", this.$.createSubMap(), JFactoryObject.descriptors.ENUMERABLE);
    }

    $react(id, container, element, ...renderOtherArguments) {
        id = this.$.react.$id_resolve(id);

        if (JFACTORY_DEV) {
            if (!jFactory.ReactDOM) {
                throw new Error("jFactory.ReactDOM=ReactDOM must be set before using the React Trait");
            }
            JFactoryExpect("id", id).typeString();
            JFactoryExpect("container", container).type(HTMLElement, jQuery);
        }

        if (JFACTORY_DEV && this.$.react.has(id)) {
            throw new JFACTORY_ERR_KEY_DUPLICATED({ target: "$react(id)", given: id })
        }

        container = jQuery(container)[0];
        let view = jFactory.ReactDOM.render(element, container, ...renderOtherArguments);
        return this.$.react.$registerSync(id, { container, view }).$value.view;
    }

    $reactRemove(id) {
        if (JFACTORY_DEV) {
            JFactoryExpect("$reactRemove(id)", id).typeString();
            if (!this.$.react.has(id)) {
                throw new JFACTORY_ERR_KEY_MISSING({
                    target: "$reactRemove(id)",
                    given: id
                })
            }
            // eslint-disable-next-line no-debugger,brace-style
            if (this.$.react.get(id)._debug_remove_called) {debugger}
            this.$.react.get(id)._debug_remove_called = true
        }

        let value = this.$.react.get(id).$value;
        let el = value.container;
        if (el) {
            if (!jFactory.ReactDOM.unmountComponentAtNode(el)) {
                if (JFACTORY_DEV) {
                    this.$logWarn("unmountComponentAtNode failed to unmount", el);
                }
            }
            jQuery(el).remove();
        }
        this.$.react.delete(id)
    }

    $reactRemoveAll(removePhase) {
        if (JFACTORY_DEV) {
            JFactoryExpect("removePhase", removePhase)
                .equalIn(TraitService.PHASES)
        }
        let subs = this.$.react;
        if (subs.size) {
            for (const [key, sub] of subs) {
                if (sub.$phaseRemove === removePhase) {
                    this.$reactRemove(key)
                }
            }
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

jFactory.TraitFetch = TraitFetch;
jFactory.TraitTimeout = TraitTimeout;
jFactory.TraitInterval = TraitInterval;
jFactory.TraitMutation = TraitMutation;
jFactory.TraitDOM = TraitDOM;
jFactory.TraitCSS = TraitCSS;
jFactory.TraitLibVue = TraitLibVue;
jFactory.TraitLibReact = TraitLibReact;