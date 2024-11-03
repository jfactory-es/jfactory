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
        {
            if (typeof config != "object" || config === null) {
                throw "argument config given to jFactoryCfg(key, config) must be an object"
            }
        }
        JFACTORY_CFG[key] = config;
    }
    return JFACTORY_CFG[key] ??= {}
}

exports.jFactoryCfg = jFactoryCfg;
