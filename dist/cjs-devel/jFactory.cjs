'use strict';

Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

const jFactoryConfig = require('./jFactory-config.cjs');

/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory
 * -----------------------------------------------------------------------------------------------------------------
 * Status: Beta
 * -----------------------------------------------------------------------------------------------------------------
 */

const jFactory = function(name, properties) {
    return Object.assign(new (jFactoryConfig.jFactoryCfg('jFactory').baseComponent)(name), properties);
};

exports.jFactory = jFactory;
