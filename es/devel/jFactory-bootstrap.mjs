import { JFACTORY_BOOT, JFACTORY_NAME, JFACTORY_VER, JFACTORY_LOG } from './jFactory-env.mjs';
import { jFactoryCompat_run } from './jFactory-compat.mjs';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Bootstrap
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

let isLoaded = false;
let seq = [];

function jFactoryBootstrap(auto) {
    if (!isLoaded) {
        if (auto && !JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        {
            console.log(`${JFACTORY_NAME} ${JFACTORY_VER} running in development mode; performances may be affected`);
            !JFACTORY_LOG && console.log("jFactory: logs disabled");
            jFactoryCompat_run();
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

function jFactoryBootstrap_expected() {
    if (!isLoaded) {
        throw new Error("jFactoryBootstrap() must be called before using jFactory")
    }
}

export { jFactoryBootstrap, jFactoryBootstrap_expected, jFactoryBootstrap_onBoot };
