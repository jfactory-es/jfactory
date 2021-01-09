/*! jFactory, (c) 2019-2021, Stéphane Plazis, http://github.com/jfactory-es/jfactory */

// ---------------------------------------------------------------------------------------------------------------------
// jFactoryCompat
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

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

let deferred = {};

export function jFactoryCompat_require(...args) {
    for (let compat of args) {
        deferred[compat.name] = compat
    }
}

export function jFactoryCompat_run(entries = deferred) {
    for (let entry of Object.values(entries)) {
        let pass;
        try {pass = Boolean(entry.test())} catch (ignore) {}
        if (!pass) {
            let msg = `jFactory may require the support of "${entry.name}", ${entry.info}`;
            if (entry.strict) {
                throw new Error(msg)
            } else {
                console.warn(msg)
            }
        }
    }
}