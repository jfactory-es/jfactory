/*!
 * jFactory, Copyright (c) 2019, Stéphane Plazis
 * https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt
 */

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Env
// ---------------------------------------------------------------------------------------------------------------------

// Compile-time immutable Env; used by Tree Shaking to remove unused code
export const JFACTORY_DEV = typeof COMPILER_DEV === "undefined" ? false : COMPILER_DEV; // Developer Mode
export const JFACTORY_DEBUG = typeof COMPILER_DEBUG === "undefined" ? false : COMPILER_DEBUG; // Debug the library
export const JFACTORY_CLI = typeof COMPILER_CLI === "undefined" ?
    (typeof process !== "undefined" && process.versions && process.versions.node) : COMPILER_CLI;

// Mutable configuration
export const jFactoryConfig = {
    TraitLog: JFACTORY_DEV && !JFACTORY_CLI || JFACTORY_DEBUG,
    JFactoryError: {
        keys: ["$.about.name", "$dev_name", "$name", "name", "id"]
    },
    JFactoryTrace: JFACTORY_DEV && !JFACTORY_CLI
        && {
            keys: ["$dev_traceLog", "$dev_traceSource"],
            libOptions: {
                offline: Boolean(globalThis.chrome), // loading sourcemaps is not required in chrome
                filter: function(value) {
                    return value.lineNumber
                    // && (value.fileName + value.functionName).toLocaleLowerCase().indexOf('jfactory') < 0
                }
            }
        },
    jFactoryDev: JFACTORY_DEV
        && {
            requireCompatibility: {
                globalThis: {
                    test: () => globalThis,
                    info: "https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/globalThis"
                },
                fetch: {
                    test: () => fetch,
                    info: "https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch"
                },
                Request: {
                    test: () => Request,
                    info: "https://developer.mozilla.org/docs/Web/API/Request"
                },
                "AbortController, AbortSignal": {
                    test: () => (new AbortController()).signal,
                    info: "https://developer.mozilla.org/docs/Web/API/AbortController, " +
                        "https://developer.mozilla.org/docs/Web/API/AbortSignal"
                },
                MutationObserver: {
                    test: () => MutationObserver,
                    info: "https://developer.mozilla.org/docs/Web/API/MutationObserver"
                }
            }
        }
};