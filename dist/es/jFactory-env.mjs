/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
const JFACTORY_NAME  = "jFactory" ;
const JFACTORY_VER   = "1.8.0-alpha" ;

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

const JFACTORY_CLI   = env("JFACTORY_ENV_CLI") ?? isNode();
const JFACTORY_REPL  = env("JFACTORY_ENV_REPL") ?? isPlayground(); // is this running in a REPL ?
const JFACTORY_DEV   = false ; // Developer Mode
const JFACTORY_LOG   = env("JFACTORY_ENV_LOG") ?? JFACTORY_DEV;
const JFACTORY_TRACE = env("JFACTORY_ENV_TRACE") ?? JFACTORY_DEV;
const JFACTORY_BOOT  = env("JFACTORY_ENV_BOOT") ?? true; // Boot jFactory at load

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
        JFACTORY_CFG[key] = val === false ? false : Object.assign(JFACTORY_CFG[key], val);
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

const jFactoryCfg = cfg;
const JFACTORY_CFG = {};

export { JFACTORY_BOOT, JFACTORY_CFG, JFACTORY_CLI, JFACTORY_DEV, JFACTORY_LOG, JFACTORY_NAME, JFACTORY_REPL, JFACTORY_TRACE, JFACTORY_VER, jFactoryCfg };
