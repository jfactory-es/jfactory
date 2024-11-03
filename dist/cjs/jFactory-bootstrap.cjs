'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryEnv = require('./jFactory-env.cjs');

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

exports.jFactoryBootstrap = jFactoryBootstrap;
exports.jFactoryBootstrap_onBoot = jFactoryBootstrap_onBoot;
