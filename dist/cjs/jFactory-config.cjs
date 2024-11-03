'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Config
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

const JFACTORY_CFG = {};
function jFactoryCfg(key, config) {
    if (config !== undefined) {
        JFACTORY_CFG[key] = config;
    }
    return JFACTORY_CFG[key] ??= {}
}

exports.jFactoryCfg = jFactoryCfg;
