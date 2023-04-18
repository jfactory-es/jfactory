import { jFactoryCfg } from './jFactory-config.mjs';

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

const jFactory = function(name, properties) {
    return Object.assign(new (jFactoryCfg('jFactory').baseComponent)(name), properties);
};

export { jFactory };
