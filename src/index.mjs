/* jFactory, Copyright (c) 2019, Stéphane Plazis, https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

// ---------------------------------------------------------------------------------------------------------------------
// jFactory bundle index (see package.json scripts to compile the /dist)
// ---------------------------------------------------------------------------------------------------------------------
// Used by the build scripts to compile modules targeting the configuration (production, development, debug...)
// Almost everything is exported; The resulting modules should be imported by a bundler that supports Tree Shacking.
// ---------------------------------------------------------------------------------------------------------------------

export * from "./jFactory";
export * from "./jFactory-bootstrap";
export * from "./jFactory-env";
export * from "./jFactory-helpers";
export * from "./jFactory-traits";

export * from "./JFactoryAbout";
export * from "./JFactoryError";
export * from "./JFactoryEvents";
export * from "./JFactoryExpect";
export * from "./JFactoryFetch";
export * from "./JFactoryFunction";
export * from "./JFactoryLogger";
export * from "./JFactoryObject";
export * from "./JFactoryPromise";
export * from "./JFactoryTime";
export * from "./JFactoryTrace";
export * from "./JFactoryTraits";

export * from "./jFactoryCompat";
export * from "./jFactoryLoader";

export * from "./TraitsCore";
export * from "./TraitsComponents";

import { jFactoryBootstrap } from "./jFactory-bootstrap";
if (typeof jFactoryOverride === "undefined" || !jFactoryOverride) {
    jFactoryBootstrap();
}