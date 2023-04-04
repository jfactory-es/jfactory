/*!
 * jFactory-devel v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
import { JFACTORY_BOOT, JFACTORY_NAME, JFACTORY_VER, JFACTORY_LOG } from './jFactory-env.mjs';
import { jFactoryCompat_run } from './jFactory-compat.mjs';

function jFactoryBootstrap(auto) {
    if (!_isLoaded) {
        if (auto && !JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        {
            console.log(`${JFACTORY_NAME} ${JFACTORY_VER} running in development mode; performances will be affected`);
            !JFACTORY_LOG && console.log("jFactory: logs disabled");
            jFactoryCompat_run();
        }
        init();
        _isLoaded = true;
    }
}

let seq = [];
function init() {
    if (seq) {
        for (let handler of seq) {
            handler();
        }
        seq = null;
    }
}

let _isLoaded = false;
function jFactoryBootstrap_expected() {
    if (!_isLoaded) {
        throw new Error("jFactoryBootstrap() must be called before using jFactory")
    }
}

function jFactoryBootstrap_onBoot(handler) {
    if (_isLoaded) {
        throw new Error("jFactoryBootstrap() already called")
    }
    seq.push(handler);
}

export { jFactoryBootstrap, jFactoryBootstrap_expected, jFactoryBootstrap_onBoot };
//# sourceMappingURL=jFactory-bootstrap.mjs.map
