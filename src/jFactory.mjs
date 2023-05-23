/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */
import { jFactoryCfg } from "./jFactory-config.mjs";

export const jFactory = function(name, properties) {
    return Object.assign(new (jFactoryCfg('jFactory').baseComponent)(name), properties);
};