/**
 * -----------------------------------------------------------------------------------------------------------------
 * jFactory entry file (see package.json scripts to compile)
 * -----------------------------------------------------------------------------------------------------------------
 * The ES version is exported as separated modules to benefit from module Tree Shaking
 * -----------------------------------------------------------------------------------------------------------------
 */

export * from "./lib/index.mjs";
export * from "./jFactory-env.mjs";
export * from "./jFactory-config.mjs";
export * from "./jFactory-helpers.mjs";
export * from "./jFactory.mjs"

import { jFactoryBootstrap } from "./jFactory-bootstrap.mjs";
jFactoryBootstrap(true)