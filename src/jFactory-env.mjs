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

export const JFACTORY_NAME  = /*#__PURE__*/ env("JFACTORY_ENV_NAME") ?? "jFactory";
export const JFACTORY_VER   = /*#__PURE__*/ env("JFACTORY_ENV_VER") ?? "(custom build)";

export const JFACTORY_CLI   = /*#__PURE__*/ env("JFACTORY_ENV_CLI") ?? /*#__PURE__*/ isNode();
export const JFACTORY_REPL  = /*#__PURE__*/ env("JFACTORY_ENV_REPL") ?? /*#__PURE__*/ isPlayground();
export const JFACTORY_DEV   = /*#__PURE__*/ env("JFACTORY_ENV_DEV") ?? false; // Developer Mode
export const JFACTORY_LOG   = /*#__PURE__*/ env("JFACTORY_ENV_LOG") ?? JFACTORY_DEV;
export const JFACTORY_TRACE = /*#__PURE__*/ env("JFACTORY_ENV_TRACE") ?? JFACTORY_DEV;
export const JFACTORY_BOOT  = /*#__PURE__*/ env("JFACTORY_ENV_BOOT") ?? true; // Boot jFactory at load

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