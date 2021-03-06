/*! jFactory, (c) 2019-2021, Stéphane Plazis, http://github.com/jfactory-es/jfactory */

// ---------------------------------------------------------------------------------------------------------------------
// jFactory entry file (see package.json scripts to compile the /dist)
// ---------------------------------------------------------------------------------------------------------------------
// Almost everything is exported; The resulting modules should be imported by a bundler that supports Tree Shacking.
// ---------------------------------------------------------------------------------------------------------------------

export * from "./indexLibs.mjs";

export * from "./jFactory-traits.mjs";
export * from "./TraitsCore.mjs";
export * from "./TraitsComponents.mjs";

export * from "./jFactory.mjs";

import { jFactoryBootstrap } from "./jFactory-bootstrap.mjs";
jFactoryBootstrap(true)