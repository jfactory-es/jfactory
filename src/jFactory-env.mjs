export const JFACTORY_NAME  = env("JFACTORY_ENV_NAME") ?? "jFactory";
export const JFACTORY_VER   = env("JFACTORY_ENV_VER") ?? "(custom build)";

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Env
// ---------------------------------------------------------------------------------------------------------------------
// Contextualize jFactory for bundle, raw source or partial export usage
// ---------------------------------------------------------------------------------------------------------------------
// JFACTORY_ENV_* are optional globals that allow contextualization at startup.
// Bundler can replace some 'env("JFACTORY_ENV_*")' with hard-coded primitives to improve tree shaking
// See https://github.com/jfactory-es/jfactory/blob/master/docs/ref-overriding.md
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta, HasSideEffects
// ---------------------------------------------------------------------------------------------------------------------

export const JFACTORY_CLI   = env("JFACTORY_ENV_CLI") ?? isNode();
export const JFACTORY_REPL  = env("JFACTORY_ENV_REPL") ?? isPlayground(); // is this running in a REPL ?
export const JFACTORY_DEV   = env("JFACTORY_ENV_DEV") ?? false; // Developer Mode
export const JFACTORY_LOG   = env("JFACTORY_ENV_LOG") ?? JFACTORY_DEV;
export const JFACTORY_TRACE = env("JFACTORY_ENV_TRACE") ?? JFACTORY_DEV;
export const JFACTORY_BOOT  = env("JFACTORY_ENV_BOOT") ?? true; // Boot jFactory at load

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
        "cdpn.io",
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

export const jFactoryCfg = cfg;
export const JFACTORY_CFG = {};