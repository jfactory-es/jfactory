/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_CLI, JFACTORY_DEV } from "./jFactory-env";
import { jFactoryConfig } from "./jFactory-config";

// ---------------------------------------------------------------------------------------------------------------------
// jFactory Loader
// ---------------------------------------------------------------------------------------------------------------------
// Status: Beta
// ---------------------------------------------------------------------------------------------------------------------

export const jFactoryLoader = {
    seq: [],
    init() {
        if (this.seq) {
            let seq = this.seq;
            delete this.seq;
            for (let module of seq) {
                module()
            }
            delete globalThis.jFactoryOverride
        }
    },
    onInit(handler) {
        this.seq.push(handler)
    }
};

function jFactoryDev() {
    console.log("jFactory is running in development mode; performances will be affected");
    for (let [name, entry] of Object.entries(jFactoryConfig.jFactoryDev.requireCompatibility)) {
        let pass;
        try {pass = Boolean(entry.test())} catch (ignore) {}
        if (!pass) {
            console.warn(`jFactory may require the support of "${name}", ${entry.info}`)
        }
    }
}

function jFactoryInit() {
    !jFactoryConfig.TraitLog && (JFACTORY_DEV || JFACTORY_CLI) && console.warn("jFactory logs disabled");
}

JFACTORY_DEV && jFactoryLoader.onInit(jFactoryDev);
jFactoryLoader.onInit(jFactoryInit);