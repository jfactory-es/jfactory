/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory Config
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */
import { JFACTORY_DEV } from "./jFactory-env.mjs";

const JFACTORY_CFG = {};
export function jFactoryCfg(key, config) {
    if (config !== undefined) {
        if (JFACTORY_DEV) {
            if (typeof config != "object" || config === null) {
                throw "argument config given to jFactoryCfg(key, config) must be an object"
            }
        }
        JFACTORY_CFG[key] = config
    }
    return JFACTORY_CFG[key] ??= {}
}