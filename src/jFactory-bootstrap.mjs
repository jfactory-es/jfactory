/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Bootstrap
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */
import {
    JFACTORY_BOOT,
    JFACTORY_DEV,
    JFACTORY_LOG,
    JFACTORY_NAME,
    JFACTORY_VER,
    JFACTORY_MOD
} from "./jFactory-env.mjs";
import { jFactoryCompat_run } from "./jFactory-compat.mjs";

let isLoaded = false;
let seq = [];

export function jFactoryBootstrap() {
    if (!isLoaded) {
        if (!JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        if (JFACTORY_DEV && JFACTORY_LOG !== 0) { // 0 => skip boot logs
            console.log(`${JFACTORY_NAME} ${JFACTORY_VER} running in development mode. ` +
                "This incurs a performance overhead.");
            JFACTORY_MOD !== "es" && console.log("jFactoryBootstrap Warning:" +
                " Consider using the ES module (jfactory/es or jfactory/es-devel) for tree-shaking.");
            !JFACTORY_LOG && console.log("jFactoryBootstrap Warning: Logs disabled by JFACTORY_LOG.");
            jFactoryCompat_run()
        }
        init();
        isLoaded = true
    }
}

function init() {
    if (seq) {
        for (let handler of seq) {
            handler()
        }
        seq = null;
    }
}

export function jFactoryBootstrap_onBoot(handler) {
    if (isLoaded) {
        throw new Error("trying to set handler for jFactoryBootstrap() but already called:\n"
            + handler.toString())
    }
    seq.push(handler)
}

export function jFactoryBootstrap_expected() {
    if (!isLoaded) {
        throw new Error("jFactoryBootstrap() must be called before using jFactory")
    }
}