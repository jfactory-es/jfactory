/* jFactory, Copyright (c) 2019-2021, Stéphane Plazis, https://github.com/jfactory-es/jfactory */

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Env
// ---------------------------------------------------------------------------------------------------------------------
// Contextualize jFactory for bundle, raw source or partial export usage
// ---------------------------------------------------------------------------------------------------------------------

// The official builder replaces this line with the version extracted from package.json
export const JFACTORY_VER = "(custom build)";

// Immutable configuration
// A builder can replace env("JFACTORY_ENV_*") by hard coded true/false primitives,
// allowing the bundler to remove unused code (Tree Shaking)
export const JFACTORY_CLI   = env("JFACTORY_ENV_CLI") ?? (isNode() || isPlayground()); // CLI Mode
export const JFACTORY_DEV   = env("JFACTORY_ENV_DEV") ?? true; // Developer Mode
export const JFACTORY_DEBUG = env("JFACTORY_ENV_DEBUG") ?? false; // Debug the library
export const JFACTORY_LOG   = env("JFACTORY_ENV_LOG") ?? (JFACTORY_DEV && !JFACTORY_CLI || JFACTORY_DEBUG)
export const JFACTORY_TRACE = env("JFACTORY_ENV_TRACE") ?? (JFACTORY_DEV && !JFACTORY_CLI || JFACTORY_DEBUG)
export const JFACTORY_BOOT  = env("JFACTORY_ENV_BOOT") ?? true; // Allow autoboot at load

export const jFactoryEnv = env;
export const jFactoryCfg = cfg;
export const JFACTORY_CFG = {};

function env(key) {
    let env = globalThis[key];
    delete globalThis[key];
    return env
}

function cfg(key, val) {
    if (JFACTORY_CFG[key] === undefined) {
        JFACTORY_CFG[key] = Object.assign({}, val, globalThis[key]);
        delete globalThis[key];
    } else if (val !== undefined) {
        JFACTORY_CFG[key] = val === false ? false : Object.assign(JFACTORY_CFG[key], val)
    }
    return JFACTORY_CFG[key]
}

function isNode() {
    return (
        typeof process === "object" &&
        typeof process.versions === "object" &&
        process.versions.node
    )
}

function isPlayground() {
    const hosts = [
        "cdpen.io",
        "fiddle.jshell.net",
        "null.jsbin.com",
        "jsitor.com",
        "jseditor.io",
        "liveweave.com",
        "run.plnkr.co",
        "playcode.io"
    ];
    try {
        return hosts.indexOf(new URL(document.location.href).hostname) !== -1
    } catch {}
}