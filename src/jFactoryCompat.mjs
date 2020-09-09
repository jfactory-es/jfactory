/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_DEV } from "./jFactory-env";

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryCompat
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export const JFACTORY_COMPAT_globalThis = {
    name: "globalThis",
    test: () => globalThis,
    info: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis"
}
export const JFACTORY_COMPAT_fetch = {
    name: "fetch",
    test: () => fetch,
    info: "https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch"
}
export const JFACTORY_COMPAT_Request = {
    name: "Request",
    test: () => Request,
    info: "https://developer.mozilla.org/docs/Web/API/Request"
}
export const JFACTORY_COMPAT_AbortController = {
    name: "AbortController/AbortSignal",
    test: () => new AbortController().signal,
    info: "https://developer.mozilla.org/docs/Web/API/AbortController, " +
        "https://developer.mozilla.org/docs/Web/API/AbortSignal"
}
export const JFACTORY_COMPAT_MutationObserver = {
    name: "MutationObserver",
    test: () => MutationObserver,
    info: "https://developer.mozilla.org/docs/Web/API/MutationObserver"
}

// ---------------------------------------------------------------------------------------------------------------------

let list = {};

export function jFactoryCompat_require(...args) {
    for (let compat of args) {
        list[compat.name] = compat
    }
}

export function jFactoryCompat_run(){
    for (let [name, entry] of Object.entries(list)) {
        let pass;
        try {pass = Boolean(entry.test())} catch (ignore) {}
        if (!pass) {
            console.warn(`jFactory may require the support of "${name}", ${entry.info}`)
        }
    }
    list = null;
}

if (JFACTORY_DEV) {
    jFactoryCompat_require(JFACTORY_COMPAT_globalThis);
}