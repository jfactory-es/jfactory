/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Env
// ---------------------------------------------------------------------------------------------------------------------

// Compile-time immutable Env; used by tree shaking to remove unused code
export const JFACTORY_DEV = typeof COMPILER_DEV === "undefined" ? false : COMPILER_DEV; // Developer Mode
export const JFACTORY_DEBUG = typeof COMPILER_DEBUG === "undefined" ? false : COMPILER_DEBUG; // Debug the library
export const JFACTORY_CLI = typeof COMPILER_CLI === "undefined" ?
    typeof process !== "undefined" && process.versions && process.versions.node : COMPILER_CLI;

// Mutable configuration; exported as properties for tree shaking
export const JFACTORY_CFG_LOG = {
    enabled: JFACTORY_DEV && !JFACTORY_CLI || JFACTORY_DEBUG
}
export const JFACTORY_CFG_JFactoryError = {
    keys: ["$.about.name", "$dev_name", "$name", "name", "id"]
}
export const JFACTORY_CFG_JFactoryTrace = JFACTORY_DEV && !JFACTORY_CLI
    && {
        keys: ["$dev_traceLog", "$dev_traceSource"],
        libOptions: {
            offline: Boolean(globalThis.chrome), // loading sourcemaps is not required in chrome
            filter: function(value) {
                return value.lineNumber
                // && (value.fileName + value.functionName).toLocaleLowerCase().indexOf('jfactory') < 0
            }
        }
    }