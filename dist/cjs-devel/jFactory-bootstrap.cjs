'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryEnv = require('./jFactory-env.cjs');
const jFactoryCompat = require('./jFactory-compat.cjs');

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
        if (!jFactoryEnv.JFACTORY_BOOT) {
            // auto bootstrap is disabled by env
            return
        }
        if (jFactoryEnv.JFACTORY_LOG !== 0) { // 0 => skip boot logs
            console.log(`${jFactoryEnv.JFACTORY_NAME} ${jFactoryEnv.JFACTORY_VER} running in development mode. ` +
                "This incurs a performance overhead.");
            jFactoryEnv.JFACTORY_MOD !== "es" && console.log("jFactoryBootstrap Warning:" +
                " Consider using the ES module (jfactory/es or jfactory/es-devel) for tree-shaking.");
            !jFactoryEnv.JFACTORY_LOG && console.log("jFactoryBootstrap Warning: Logs disabled by JFACTORY_LOG.");
            jFactoryCompat.jFactoryCompat_run();
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

exports.jFactoryBootstrap = jFactoryBootstrap;
exports.jFactoryBootstrap_expected = jFactoryBootstrap_expected;
exports.jFactoryBootstrap_onBoot = jFactoryBootstrap_onBoot;
