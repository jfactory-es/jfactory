/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Env
 * -----------------------------------------------------------------------------------------------------------------
 * Contextualize jFactory for bundle, raw source or partial export usage
 * -----------------------------------------------------------------------------------------------------------------
 * JFACTORY_ENV_* are optional globals that allow contextualization at startup.
 * Bundler can replace some 'env("JFACTORY_ENV_*")' with hard-coded primitives to improve tree shaking
 * See https://github.com/jfactory-es/jfactory/blob/master/docs/ref-overriding.md
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

const JFACTORY_NAME  = "jFactory";
const JFACTORY_VER   = "1.8.0-alpha.2";
const JFACTORY_DEV   = false; // Developer Mode
const JFACTORY_MOD   = "es" ?? "raw";

const JFACTORY_CLI   = /*#__PURE__*/ env("JFACTORY_ENV_CLI") ?? /*#__PURE__*/ isNode();
const JFACTORY_REPL  = /*#__PURE__*/ env("JFACTORY_ENV_REPL") ?? /*#__PURE__*/ isPlayground();
const JFACTORY_LOG   = /*#__PURE__*/ env("JFACTORY_ENV_LOG") ?? JFACTORY_DEV;
const JFACTORY_TRACE = /*#__PURE__*/ env("JFACTORY_ENV_TRACE") ?? JFACTORY_DEV;
const JFACTORY_BOOT  = /*#__PURE__*/ env("JFACTORY_ENV_BOOT") ?? true; // Boot jFactory at load

function env(key) {
    return globalThis[key]
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

export { JFACTORY_BOOT, JFACTORY_CLI, JFACTORY_DEV, JFACTORY_LOG, JFACTORY_MOD, JFACTORY_NAME, JFACTORY_REPL, JFACTORY_TRACE, JFACTORY_VER };
