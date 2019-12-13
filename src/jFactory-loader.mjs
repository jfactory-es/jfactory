/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_CLI, JFACTORY_DEV, jFactoryConfig } from "./jFactory-env";

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

export function jFactoryDev() {
    console.warn("jFactory: RUNNING IN DEVELOPER MODE, PERFORMANCES WILL BE AFFECTED");
    for (let [name, entry] of Object.entries(jFactoryConfig.jFactoryDev.requireCompatibility)) {
        let pass;
        try {pass = Boolean(entry.test())} catch (ignore) {}
        if (!pass) {
            console.warn(`jFactory may require the support of "${name}", ${entry.info}`)
        }
    }
}

export function jFactoryInit() {
    !jFactoryConfig.TraitLog && (JFACTORY_DEV || JFACTORY_CLI) && console.warn("jFactory: LOGS REMOVED");
}

JFACTORY_DEV && jFactoryLoader.onInit(jFactoryDev);
jFactoryLoader.onInit(jFactoryInit);