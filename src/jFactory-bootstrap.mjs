/* jFactory, Copyright (c) 2019-2021, Stéphane Plazis, https://github.com/jfactory-es/jfactory */

import { JFACTORY_DEV } from "./jFactory-env.mjs";
import { JFACTORY_VER } from "./jFactory-env.mjs";
import { JFACTORY_LOG } from "./jFactory-env.mjs";
import { JFACTORY_BOOT } from "./jFactory-env.mjs";
import { jFactoryCompat_run } from "./jFactory-compat.mjs";

export function jFactoryBootstrap(auto) {
    if (!_isLoaded) {
        if (auto && !JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        if (JFACTORY_DEV) {
            console.log(`jFactory ${JFACTORY_VER} running in development mode; performances will be affected`);
            !JFACTORY_LOG && console.log("jFactory: logs disabled");
            jFactoryCompat_run()
        }
        init();
        _isLoaded = true
    }
}

let seq = [];
function init() {
    if (seq) {
        for (let handler of seq) {
            handler()
        }
        seq = null;
    }
}

let _isLoaded = false;
export function jFactoryBootstrap_expected() {
    if (!_isLoaded) {
        throw new Error("jFactoryBootstrap() must be called before using jFactory")
    }
}

export function jFactoryBootstrap_onBoot(handler) {
    if (_isLoaded) {
        throw new Error("jFactoryBootstrap() already called")
    }
    seq.push(handler)
}