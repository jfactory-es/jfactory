/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

import { JFACTORY_DEV } from "./jFactory-env";
import { JFACTORY_CFG_LOG } from "./jFactory-env";
import { jFactoryCompat_run } from "./jFactoryCompat";
import { jFactoryLoader_init } from "./jFactoryLoader";

export function jFactoryBootstrap() {
    if (JFACTORY_DEV) {
        console.log("jFactory is running in development mode; performances will be affected");
        !JFACTORY_CFG_LOG.enabled && console.warn("jFactory logs disabled");
    }
    jFactoryLoader_init();
    if (JFACTORY_DEV) {
        jFactoryCompat_run()
    }
}