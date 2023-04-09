/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Bootstrap
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */
import { JFACTORY_BOOT, JFACTORY_DEV, JFACTORY_LOG, JFACTORY_NAME, JFACTORY_VER } from "./jFactory-env.mjs";
import { jFactoryCompat_run } from "./jFactory-compat.mjs";

let isLoaded = false;
let seq = [];

export function jFactoryBootstrap(auto) {
    if (!isLoaded) {
        if (auto && !JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        if (JFACTORY_DEV) {
            console.log(`${JFACTORY_NAME} ${JFACTORY_VER} running in development mode; performances may be affected`);
            !JFACTORY_LOG && console.log("jFactory: logs disabled");
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