/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
// ---------------------------------------------------------------------------------------------------------------------
// jFactoryCompat
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

const JFACTORY_COMPAT_fetch = {
    name: "fetch",
    test: () => fetch,
    info: "https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch"
};
const JFACTORY_COMPAT_Request = {
    name: "Request",
    test: () => Request,
    info: "https://developer.mozilla.org/docs/Web/API/Request"
};
const JFACTORY_COMPAT_AbortController = {
    name: "AbortController/AbortSignal",
    test: () => new AbortController().signal,
    info: "https://developer.mozilla.org/docs/Web/API/AbortController, " +
        "https://developer.mozilla.org/docs/Web/API/AbortSignal"
};
const JFACTORY_COMPAT_MutationObserver = {
    name: "MutationObserver",
    test: () => MutationObserver,
    info: "https://developer.mozilla.org/docs/Web/API/MutationObserver"
};

// ---------------------------------------------------------------------------------------------------------------------

let deferred = {};

function jFactoryCompat_require(...args) {
    for (let compat of args) {
        deferred[compat.name] = compat;
    }
}

function jFactoryCompat_run(entries = deferred) {
    for (let entry of Object.values(entries)) {
        let pass;
        try {pass = Boolean(entry.test());} catch (ignore) {}
        if (!pass) {
            let msg = `jFactory may require the support of "${entry.name}", ${entry.info}`;
            if (entry.strict) {
                throw new Error(msg)
            } else {
                console.warn(msg);
            }
        }
    }
}

export { JFACTORY_COMPAT_AbortController, JFACTORY_COMPAT_MutationObserver, JFACTORY_COMPAT_Request, JFACTORY_COMPAT_fetch, jFactoryCompat_require, jFactoryCompat_run };
