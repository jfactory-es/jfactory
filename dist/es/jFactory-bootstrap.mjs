import { JFACTORY_BOOT } from './jFactory-env.mjs';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Bootstrap
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

let isLoaded = false;
let seq = [];

function jFactoryBootstrap() {
    if (!isLoaded) {
        if (!JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        init();
        isLoaded = true;
    }
}

function init() {
    if (seq) {
        for (let handler of seq) {
            handler();
        }
        seq = null;
    }
}

function jFactoryBootstrap_onBoot(handler) {
    if (isLoaded) {
        throw new Error("trying to set handler for jFactoryBootstrap() but already called:\n"
            + handler.toString())
    }
    seq.push(handler);
}

export { jFactoryBootstrap, jFactoryBootstrap_onBoot };
