'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Compat
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

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

// -----------------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------------

let deferred = {};

function jFactoryCompat_require(...args) {
    for (let compat of args) {
        deferred[compat.name] = compat;
    }
}

exports.JFACTORY_COMPAT_AbortController = JFACTORY_COMPAT_AbortController;
exports.JFACTORY_COMPAT_Request = JFACTORY_COMPAT_Request;
exports.JFACTORY_COMPAT_fetch = JFACTORY_COMPAT_fetch;
exports.jFactoryCompat_require = jFactoryCompat_require;
